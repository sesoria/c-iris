import Stream from "./Stream";
import { addDetection } from '../../slices/detectionsSlice';
import { Box } from "@mui/material";
import LogsTimeline from "./LogsTimeline";
import { useDispatch } from 'react-redux';
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import StreamSkeleton from "../skeletons/StreamSkeleton";
import { useGetHlsStreamUrlQuery, useGetStreamsQuery } from "../../api/streamsApi";

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
  console.log(`streamsData=${streamsData}; isStreamsLoading=${isStreamsLoading}; isHlsLoading=${isHlsLoading}; hlsUrl=${hlsUrl}`)
  console.log(hlsUrl);
  const wsRef = useRef(null); // Referencia al WebSocket para asegurarnos de que no se recree
  const [currentUrl, setCurrentUrl] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8765");
    const ws = wsRef.current;

    ws.onopen = () => console.log("WebSocket connected");

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (
            typeof data === "object" &&
            data !== null &&
            data.timestamp &&
            Array.isArray(data.labels)
        ) {
            data.labels = data.labels.flat(); // Asegura que los labels sean un array plano
            console.log("Recibido:", data);

            dispatch(addDetection({
                stream_name: streamName,  // **Asegura que esta variable tenga el nombre correcto del stream**
                timestamp: data.timestamp,
                fragment_number: data.fragment_number,
                labels: data.labels
            }));
        } else {
            console.warn("Estructura de datos inválida:", data);
        }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
}, [dispatch, streamName]); // **Asegura que `streamName` está en las dependencias**


  const addLog = () => {
    const timestamp = new Date().toLocaleString();
    const exampleLog = {
      timestamp,
      labels: [
        { Name: 'Neighborhood', Confidence: 99.99 },
        { Name: 'City', Confidence: 99.98 },
        { Name: 'Person', Confidence: 98.77 }
      ]
    };
    dispatch(addDetection(exampleLog)); // Solo actualiza si los datos son válidos

    // setLabels(exampleLog);
  };


  useEffect(() => {
    if (hlsUrl) {
      setCurrentUrl(hlsUrl["HLSStreamingSessionURL"]); // Usa la URL obtenida si está disponible
    }
    else if (urlOffline)
      setCurrentUrl(urlOffline); // Usa la URL offline en caso de error
  }, [hlsUrl, urlOffline]);


  if (error && error.status === 404) {
    const errorMessage = error.data?.message || "Error desconocido";
    return <p>Error: {errorMessage} (Status: {error.status} ABRE STREAM)</p>;
  }

  return (
    isLoading ? <StreamSkeleton /> :
      <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <Box component='section' flex={1} minWidth='0' sx={{ width: { xs: '100%', md: '70%' }, maxWidth: { xs: '100%', md: '70%' }, mb: { xs: 2, md: 0 } }}>
          <Stream url={currentUrl} streamName={streamName}/>
        </Box>
        <Box component='section' flex={1} minWidth='0' sx={{ width: { xs: '100%', md: '30%' }, maxWidth: { xs: '100%', md: '30%' } }}>
          <LogsTimeline streamName={streamName}/>
        </Box>
        <button onClick={addLog}>Add Log</button>
      </Box>
  )
}