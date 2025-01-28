import { Box } from "@mui/material";
import LogsTimeline from "./LogsTimeline";
import Stream from "./Stream";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useGetHlsStreamUrlQuery, useGetStreamsQuery } from "../../api/streamsApi";
import StreamSkeleton from "../skeletons/StreamSkeleton";

export default function StreamingPage() {
  const location = useLocation();
  const { streamName } = location.state || {}; // Recupera el nombre desde el state

  const { data: streamsData, isLoading: isStreamsLoading } = useGetStreamsQuery();

  const urlOffline = streamsData?.find((stream) => stream.stream_name === streamName)?.url;
  
  // Solo realiza la segunda llamada cuando se haya completado la primera y no se haya encontrado `urlOffline`.
  const skipSecondCall = isStreamsLoading || Boolean(urlOffline);
  
  const { data: hlsUrl, error, isLoading: isHlsLoading } = useGetHlsStreamUrlQuery(streamName, {
    skip: skipSecondCall, // Usa `skip` si la primera llamada está cargando o ya existe `urlOffline`.
  });

  const isLoading = isStreamsLoading || isHlsLoading;

  const wsRef = useRef(null); // Referencia al WebSocket para asegurarnos de que no se recree
  
  const [currentUrl, setCurrentUrl] = useState(null);


  // Configurar el WebSocket
  useEffect(() => {
    // wsRef.current = new WebSocket("wss://ws.postman-echo.com/raw");
    console.log("Creando web-socket cliente")
    wsRef.current = new WebSocket("ws://localhost:8765");
    const ws = wsRef.current;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      console.log(event.data)
      const data = JSON.parse(event.data); // Datos JSON recibidos
      if (Array.isArray(data)) {
        console.log(data); // Actualizar bounding boxes
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close(); // Cerrar el WebSocket cuando se desmonte
    };
  }, []);


  useEffect(() => {
    if (hlsUrl) {
      setCurrentUrl(hlsUrl[""]); // Usa la URL obtenida si está disponible
    }
    else if (urlOffline)
      setCurrentUrl(urlOffline); // Usa la URL offline en caso de error
  }, [hlsUrl, urlOffline]);


  if (error && error.status === 404) {
    const errorMessage = error.data?.message || "Error desconocido";
    return <p>Error: {errorMessage} (Status: {error.status} ABRE STREAM)</p>;
  }

  return (
    isLoading ? <StreamSkeleton/> :
      <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
          <Box component='section' flex={1} minWidth='0' sx={{ width: { xs: '100%', md: '70%' }, maxWidth: { xs: '100%', md: '70%' }, mb: { xs: 2, md: 0 } }}>
            <Stream url={currentUrl} />
          </Box>
          <Box component='section' flex={1} minWidth='0' sx={{ width: { xs: '100%', md: '30%' }, maxWidth: { xs: '100%', md: '30%' } }}>
            <LogsTimeline />
          </Box>
      </Box>
  )
}