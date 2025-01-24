import os
import json
import boto3
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from botocore.exceptions import BotoCoreError, ClientError, NoCredentialsError
from cachetools import TTLCache
# Crear un caché con un máximo de 100 entradas y un TTL de 300 segundos
hls_cache = TTLCache(maxsize=100, ttl=21600)

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Dominio que tiene permitido acceder
    allow_credentials=True,
    allow_methods=["*"],  # Métodos permitidos, por ejemplo, GET, POST
    allow_headers=["*"],  # Encabezados permitidos
)

# Configura tu cliente de AWS Kinesis
kinesis_client = boto3.client("kinesisvideo")  # Cambia la región según sea necesario
s3_client = boto3.client("s3")

BUCKET_NAME = "c-iris"
DYNAMODB_TABLE = "c-iris"
STREAM_NAME = "camera_cinnado"
STREAMS_DATA = [
    {
        "name": "camera_cinnado",
        "url": ""
    },
    {
        "name": "Dragon",
        "url": f"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    },
    {
        "name": "Tears of Steel",
        "url": f"https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
    },
    {
        "name": "Beep",
        "url": f"https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    }
]

# Ruta temporal para guardar thumbnails
TEMP_DIR = "/tmp/thumbnails"
os.makedirs(TEMP_DIR, exist_ok=True)


@app.get("/get_thumbnails")
async def get_thumbnails(streams: str):
    """
    Obtiene un thumbnail en S3 del stream de KVS.
    """
    print("Streams recibidos:", streams)
    try:
        stream_names = json.loads(streams)
        thumbnails = []
        for stream in stream_names:
            s3_url = get_from_s3(stream)
            thumbnails.append({"title": stream, "cover": s3_url})
        thumbnails += generate_random_images(5)
        return thumbnails
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

def get_from_s3(stream_name: str):
    """
    Obtiene un archivo del bucket S3 y genera una URL pre-firmada para acceder a él.
    """
    try:
        # Listar los objetos con el prefijo dado
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=f"thumbnails/{stream_name}/")

        # Verificar si se encontraron objetos
        if 'Contents' not in response:
            raise HTTPException(status_code=404, detail="No se encontraron objetos en el bucket")

        # Filtrar objetos válidos (evitar directorios o elementos vacíos)
        valid_objects = [obj for obj in response['Contents'] if obj['Size'] > 0]

        if len(valid_objects) != 1:
            raise HTTPException(status_code=404, detail="No se encontró un único objeto para el stream")

        # Obtener la clave del único objeto válido
        object_key = valid_objects[0]['Key']

        # Generar la URL pre-firmada para el objeto
        s3_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': object_key},
            ExpiresIn=3600  # La URL expirará en 1 hora
        )

        return s3_url

    except NoCredentialsError:
        raise HTTPException(status_code=403, detail="Credenciales de AWS no encontradas")
    except Exception as e:
        print(f"Error al obtener de S3: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener el archivo de S3.")


@app.get("/get_hls_url")
async def get_hls_url(stream_name: str):
    """
    Devuelve una URL firmada HLS, utilizando caché para mejorar el rendimiento.
    """
    hls_url = get_cached_hls_url(stream_name)
    return {"hls_url": hls_url}

def get_cached_hls_url(stream_name: str):
    """
    Obtiene una URL HLS desde el caché o la genera si no está disponible.
    """
    local_stream = [stream["url"] for stream in STREAMS_DATA if stream_name == stream["name"]]
    if local_stream:
        print("localstream")
        return local_stream[0]

    if stream_name in hls_cache:
        print("\nANTIGUA URL\n")
        return hls_cache[stream_name]  # Retorna la URL desde el caché

    # Generar una nueva URL si no está en el caché
    hls_url = get_hls_stream_url(stream_name)
    print("\nNUEVA URL\n")
    hls_cache[stream_name] = hls_url  # Almacenar la URL en el caché
    return hls_url

def get_hls_stream_url(stream_name: str):
    """
    Genera una URL firmada para el stream HLS.
    """
    try:
        # Obtener la URL de control del stream
        endpoint = kinesis_client.get_data_endpoint(
            StreamName=stream_name,
            APIName="GET_HLS_STREAMING_SESSION_URL"
        )["DataEndpoint"]

        # Crear un cliente específico para HLS
        hls_client = boto3.client("kinesis-video-archived-media", endpoint_url=endpoint)

        # Generar la URL firmada HLS
        response = hls_client.get_hls_streaming_session_url(
            StreamName=stream_name,
            Expires=21600,
            PlaybackMode="LIVE",
            HLSFragmentSelector={
                "FragmentSelectorType": "SERVER_TIMESTAMP",
                # "TimestampRange": {
                #     "StartTimestamp": 0,
                #     "EndTimestamp": playback_duration
                # }
            }
        )

        return response["HLSStreamingSessionURL"]

    except (BotoCoreError, ClientError) as error:
        raise HTTPException(status_code=500, detail=f"Error generating HLS URL: {str(error)}")


@app.get("/get_carousel_data")
async def get_random_images():
    """
    Devuelve una lista de 5 imágenes aleatorias.
    """
    images = generate_random_images(5)
    return images

def generate_random_images(count=5):
    """
    Genera una lista de imágenes aleatorias usando Picsum Photos.
    """
    images = []
    for _ in range(count):
        width = random.randint(500, 700)
        height = random.randint(200, 300)
        idx = random.randint(1,3)
        images.append({
            "cover": f"https://picsum.photos/{width}/{height}",
            "title": STREAMS_DATA[idx]["name"]
        })
    return images


@app.get("/get_streams_data")
async def get_random_streams():
    """
    Devuelve una lista de informacion sobre streams
    """
    return get_all_items(DYNAMODB_TABLE)

def get_all_items(table_name):
    # Conexión al servicio DynamoDB
    dynamodb = boto3.resource('dynamodb')

    # Conexión a la tabla
    table = dynamodb.Table(table_name)

    # Escanear la tabla para obtener todos los elementos
    response = table.scan()
    items = response['Items']

    # Continuar escaneando si hay más elementos (paginación)
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response['Items'])

    return items




