import { Chip } from "@mui/material";
import MovieIcon from '@mui/icons-material/Movie';
import { styled } from "@mui/system";

const StyledVODChip = styled(Chip)(() => ({
  fontWeight: "bold",
    backgroundColor: "#1976d2",
    color: "#fff",
    "& .MuiChip-icon": {
        color: "#fff"
    },
}));

export default function VODIndicator({ size = "medium", sx = {} }) {
  return (
    <StyledVODChip
      icon={<MovieIcon sx={{ fontSize: size === "small" ? 16 : 20 }} />}
      label="VOD"
      size={size}
      sx={sx}
    />
  );
}
