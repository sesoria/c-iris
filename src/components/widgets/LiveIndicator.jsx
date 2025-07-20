import { Chip } from "@mui/material";
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { styled } from "@mui/system";

const StyledLiveChip = styled(Chip)(({ theme }) => ({
  fontWeight: "bold",
  animation: "pulse 1s infinite",
  "@keyframes pulse": {
    "0%": { boxShadow: "0 0 0 0 rgba(255, 0, 0, 0.6)" },
    "70%": { boxShadow: "0 0 0 10px rgba(255, 0, 0, 0)" },
    "100%": { boxShadow: "0 0 0 0 rgba(255, 0, 0, 0)" }
  }
}));

export default function LiveIndicator({ size = "medium", sx = {} }) {
  return (
    <StyledLiveChip
      icon={<LiveTvIcon sx={{ fontSize: size === "small" ? 16 : 20 }} />}
      label="LIVE"
      color="error"
      size={size}
      sx={sx}
    />
  );
}
