import { useEffect, useState, useRef } from "react";
import Main from "../layouts/Main";
import Stream from "./Stream";
import LogsTimeline from "./LogsTimeline";
import StreamTags from "./StreamTags";
import LiveIndicator from "../widgets/LiveIndicator"
import VODIndicator from "../widgets/VODIndicator"

import { Box, Typography, Switch, FormControlLabel } from "@mui/material";
import { Gite, Movie, SmartToy } from '@mui/icons-material';
import { data, useLocation } from "react-router-dom";
import useWebSocket from "../../hooks/useWebSocket";
import StreamSkeleton from "../skeletons/StreamSkeleton";
import { useGetHlsStreamUrlQuery, useGetStreamsQuery } from "../../api/streamsApi";


const getIconForVideoType = (type) => {
  const size = '2rem';

  switch (type?.toLowerCase()) {
    case 'home': return <Gite sx={{ fontSize: size }} />;
    case 'movie': return <Movie sx={{ fontSize: size }} />;
    default: return null;
  }
};

const getVideoType = (type) => {
  switch (type?.toLowerCase()) {
    case 'home': return <LiveIndicator size="small" />;
    case 'movie': return <VODIndicator />;
    default: return null;
  }
};

const StreamInfo = ({ streamData }) => {
  const [isEnabled, setIsEnabled] = useState(() => streamData?.task_status === "active");
  const [loading, setLoading] = useState(false);

  const handleSwitchChange = async (event) => {
    const newValue = event.target.checked;
    setIsEnabled(newValue); // estado controlado solo localmente
    setLoading(true);

    const action = newValue ? 'start' : 'stop';
    const url = `https://phvitrbi12.execute-api.eu-west-1.amazonaws.com/start_ecs?stream_name=${streamData?.stream_name}&action=${action}`;

    try {
      await fetch(url);
    } catch (error) {
      setIsEnabled(!newValue); // revertimos si falla
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2, mb: 2, pb: 1 }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 'bold', marginBottom: 0 }}
        >
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              marginRight: '8px',
              verticalAlign: 'middle',
            }}
          >
            {getIconForVideoType(streamData?.type)}
          </Box>
          {streamData?.stream_name}
        </Typography>
        <FormControlLabel
          style={{marginRight: "45px"}}
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <SmartToy fontSize="medium" style={{ marginRight: "5px" }} />
              <span>Activar detección</span>
            </Box>
          }
          labelPlacement="start"
          control={<Switch checked={isEnabled} onChange={handleSwitchChange} disabled={loading}/>}
        />
      </Box>
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          marginRight: '8px',
          verticalAlign: 'middle',
        }}
      >
        {getVideoType(streamData?.type)}
      </Box>

      {streamData?.description}
      <StreamTags tags={streamData?.tags} />
    </>
  );
};

const LogsSection = ({ streamName }) => (
  <Box
    className="no-padding"
    component="section"
    flex={1}
    minWidth={0}
    sx={{
      width: { xs: '100%', md: '30%' },
      maxWidth: { xs: '100%', md: '30%' },
    }}
  >
    <Typography
      variant="h6"
      component="h2"
      sx={{
        mt: 2,
        mb: 2,
        textAlign: 'center',
        fontWeight: 'bold',
        borderBottom: '2px solid',
        borderColor: 'divider',
        pb: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <img src="/siren-icon.svg" alt="Siren" style={{ width: 32, height: 32 }} />
      Detecciones recientes
      <img src="/siren-icon.svg" alt="Siren" style={{ width: 32, height: 32 }} />
    </Typography>

    <LogsTimeline streamName={streamName} />
  </Box>
);

export default function StreamingPage() {
  const location = useLocation();
  const { streamName } = location.state || {};

  const { data: streamsData, isLoading: isStreamsLoading } = useGetStreamsQuery();
  const streamData = streamsData?.find((s) => s.stream_name === streamName);
  const urlOffline = streamData?.url;

  const skipSecondCall = isStreamsLoading || Boolean(urlOffline);
  const { data: hlsUrl, error, isLoading: isHlsLoading } = useGetHlsStreamUrlQuery(streamName, {
    skip: skipSecondCall,
  });

  const isLoading = isStreamsLoading || isHlsLoading;
  const [currentUrl, setCurrentUrl] = useState(null);

  useWebSocket(streamName);

  useEffect(() => {
    if (hlsUrl) {
      setCurrentUrl(hlsUrl["HLSStreamingSessionURL"]);
    } else if (urlOffline) {
      setCurrentUrl(urlOffline);
    }
  }, [hlsUrl, urlOffline]);

  if (error && error.status === 404) {
    const errorMessage = error.data?.message || "Error desconocido";
    return <p>Error: {errorMessage} (Status: {error.status} ABRE STREAM)</p>;
  }

  return isLoading ? (
    <StreamSkeleton />
  ) : (
    <Main>
      <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <Box component='section' flex={1} minWidth='0' sx={{ width: { xs: '100%', md: '70%' }, maxWidth: { xs: '100%', md: '70%' }, mb: { xs: 2, md: 0 } }}>
          <Stream url={currentUrl} streamName={streamName} />
          <StreamInfo streamData={streamData} />
        </Box>
        <LogsSection streamName={streamName} />
      </Box>
    </Main>
  );
}