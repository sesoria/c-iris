import Main from "../layouts/Main";
import Stream from "./Stream";
import { Box } from "@mui/material";
import LogsTimeline from "./LogsTimeline";
import { useLocation } from "react-router-dom";
import useWebSocket from "../../hooks/useWebSocket";
import { useEffect, useState } from "react";
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
  const [currentUrl, setCurrentUrl] = useState(null);

  useWebSocket(streamName); // Llamamos al hook

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
    <Main>
      <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <Box component='section' flex={1} minWidth='0' sx={{ width: { xs: '100%', md: '70%' }, maxWidth: { xs: '100%', md: '70%' }, mb: { xs: 2, md: 0 } }}>
          <Stream url={currentUrl} streamName={streamName}/>
        </Box>
        <Box component='section' flex={1} minWidth='0' sx={{ width: { xs: '100%', md: '30%' }, maxWidth: { xs: '100%', md: '30%' } }}>
          <LogsTimeline streamName={streamName}/>
        </Box>
      </Box>
    </Main>
  )
}