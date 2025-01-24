import { Box } from "@mui/material";
import LogsTimeline from "./LogsTimeline";
import Stream from "./Stream";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectConfig } from "../../slices/configSlice";

export default function StreamingPage() {
  const location = useLocation();
  const { stream_name } = location.state || {}; // Recupera el nombre desde el state
  const { serverHost } = useSelector(selectConfig);
  const [hlsUrl, setHlsUrl] = useState(""); // Estado para guardar la URL

  useEffect(() => {
    const fetchHlsStreamUrl = async () => {
      try {
        const response = await fetch(`${serverHost}/get_hls_url?stream_name=${stream_name}`);
        if (!response.ok) {
          throw new Error("Failed to fetch HLS URL");
        }
        console.log("recibi la url")
        const data = await response.json();
        setHlsUrl(data.hls_url);
        console.log("HLS URL:", data.hls_url);
      } catch (error) {
        console.error("Error fetching HLS URL:", error);
        // Usar imagen predeterminada si ocurre un error
      }
    };
    fetchHlsStreamUrl();
  }, [serverHost, stream_name]);

  return (
    <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
      <Box component='section' flex={1} minWidth='0' sx={{ width: { xs: '100%', md: '70%' }, maxWidth: { xs: '100%', md: '70%' }, mb: { xs: 2, md: 0 } }}>
        <Stream url={hlsUrl} />
      </Box>
      <Box component='section' flex={1} minWidth='0' sx={{ width: { xs: '100%', md: '30%' }, maxWidth: { xs: '100%', md: '30%' } }}>
        <LogsTimeline />
      </Box>
    </Box>
  )
}