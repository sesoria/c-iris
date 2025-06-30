import {
  Card,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import LiveTvIcon from '@mui/icons-material/LiveTv';

const CardContainer = styled(Card)({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  borderRadius: "12px",
  height: 250,
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
});

const BackgroundImage = styled(CardMedia)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  filter: "brightness(0.7)",
  transition: "filter 0.3s ease",
  "&:hover": {
    filter: "brightness(1)",
  },
});

const TextOverlay = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  padding: "12px",
  background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)",
  color: "#fff",
});

const LiveBadge = styled(Chip)({
  position: "absolute",
  top: 8,
  left: 8,
  fontWeight: "bold",
  animation: "pulse 1s infinite",
});

export default function StreamCard({ title, imageUrl }) {
  return (
    <CardContainer>
      <BackgroundImage
        component="img"
        image={imageUrl}
        alt="Stream Thumbnail"
      />

      <LiveBadge
        icon={<LiveTvIcon />}
        label="LIVE"
        color="error"
      />

      <TextOverlay>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ opacity: 0.85 }}
        >
          Some brief description of the stream...
        </Typography>
      </TextOverlay>
    </CardContainer>
  );
}