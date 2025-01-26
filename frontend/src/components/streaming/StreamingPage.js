import { Box } from "@mui/material";
import LogsTimeline from "./LogsTimeline";
import Stream from "./Stream";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetHlsStreamUrlQuery, useGetStreamsQuery } from "../../api/streamsApi";
import StreamSkeleton from "../skeletons/StreamSkeleton";

export default function StreamingPage() {
  const location = useLocation();
  const { streamName } = location.state || {}; // Recupera el nombre desde el state

  const { data: streamsData } = useGetStreamsQuery();

  const urlOffline = streamsData?.find((stream) => stream.stream_name === streamName)?.url;
  const { data: hlsUrl, error, isLoading } = useGetHlsStreamUrlQuery(streamName, {
    skip: urlOffline, // Usa `skip` si `urlOffline` existe
  });

  const [currentUrl, setCurrentUrl] = useState(null);

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