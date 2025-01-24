import boto3
from botocore.exceptions import BotoCoreError, ClientError
import os
import uuid
import datetime
import io  # Importa BytesIO

# Configuración de AWS
kvs_client = boto3.client("kinesisvideo", region_name="eu-west-1")
s3_client = boto3.client("s3", region_name="eu-west-1")
BUCKET_NAME = "c-iris"
STREAM_NAME = "camera_cinnado"

def get_data_endpoint(stream_name: str):
    """Obtiene el endpoint de datos para el stream de KVS."""
    try:
        response = kvs_client.get_data_endpoint(
            StreamName=stream_name,
            APIName="GET_IMAGES"
        )
        return response["DataEndpoint"]
    except (BotoCoreError, ClientError) as e:
        raise RuntimeError(f"Error obteniendo el endpoint de datos: {e}")

def get_timestamp_range(seconds=10):
    """Genera un rango de timestamps basado en el tiempo actual."""
    now = datetime.datetime.utcnow()
    timestamp_actual = now.isoformat() + "Z"
    timestamp_futuro = (now + datetime.timedelta(seconds=seconds)).isoformat() + "Z"
    return timestamp_actual, timestamp_futuro

def get_image_from_kvs(data_endpoint: str, stream_name: str):
    """Obtiene una imagen del stream de KVS en un rango de tiempo específico."""
    kvs_media_client = boto3.client("kinesis-video-archived-media", endpoint_url=data_endpoint)

    timestamp_actual, timestamp_futuro = get_timestamp_range()
    print("Timestamp actual:", timestamp_actual)
    print("Timestamp futuro:", timestamp_futuro)

    try:
        params = {
            "StreamName": stream_name,
            "Format": "JPEG",
            "ImageSelectorType": "PRODUCER_TIMESTAMP",
            "StartTimestamp": timestamp_actual,
            "EndTimestamp": timestamp_futuro,
            "SamplingInterval": 3000
        }

        response = kvs_media_client.get_images(**params)
        if "Images" not in response or not response["Images"]:
            raise ValueError("No se encontraron imágenes en el stream.")

        # Obtener los datos de la imagen
        image_data = response["Images"][0]["ImageContent"]
        timestamp_str = datetime.datetime.now() + datetime.timedelta(hours=1)
        timestamp_str = datetime.datetime.utcnow().strftime("%Y-%m-%d_%H-%M-%S")
        image_name = f"{stream_name}_{timestamp_str}"
        # Asegurarse de que `image_data` sea de tipo `bytes`
        if isinstance(image_data, str):
            import base64
            image_data = base64.b64decode(image_data)

        # Usar BytesIO para cargar los datos en memoria
        image_bytes = io.BytesIO(image_data)

        return image_bytes, image_name
    except (BotoCoreError, ClientError) as e:
        raise RuntimeError(f"Error obteniendo la imagen de KVS: {e}")

def upload_to_s3(file_obj, key: str):
    """Sube un archivo a S3 desde un objeto en memoria (file-like object)."""
    try:
        s3_client.upload_fileobj(file_obj, BUCKET_NAME, key)
        s3_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{key}"
        return s3_url
    except Exception as e:
        raise RuntimeError(f"Error al subir a S3: {e}")

def generate_and_upload_thumbnail(stream_name: str):
    """Genera un thumbnail del stream de KVS y lo guarda en S3."""
    image_obj = None
    try:
        # Obtener el endpoint de datos
        data_endpoint = get_data_endpoint(stream_name)

        # Obtener la imagen de KVS
        image_obj, image_name = get_image_from_kvs(data_endpoint, stream_name)

        # Generar un nombre para el archivo en S3
        thumbnail_name = f"thumbnails/{stream_name}/{image_name}.jpg"

        # Subir la imagen directamente a S3
        s3_url = upload_to_s3(image_obj, thumbnail_name)

        return s3_url
    finally:
        # Limpiar el archivo en memoria (no es estrictamente necesario con BytesIO)
        if image_obj:
            image_obj.close()

# Ejecución del script
try:
    print("Generando thumbnail...")
    s3_url = generate_and_upload_thumbnail(STREAM_NAME)
    print(f"Thumbnail subido a S3: {s3_url}")
except Exception as e:
    print(f"Error: {e}")
