import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import LiveTvIcon from '@mui/icons-material/LiveTv';

const GradientOverlay = styled(Box)(() => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(180deg, transparent 46%, rgba(0,0,0,0.7) 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
    borderRadius: "8px",
}));

const CardContainer = styled(Card)(({
    position: "relative",
    overflow: "hidden",
    width: '100%', // Ocupa el ancho completo de la columna del Grid    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        "& .overlay": {
            opacity: 1,
        },
        "& img": {
            filter: "brightness(1)",
        },
    },
    "& img": {
        filter: "brightness(0.85)",
        transition: "filter 0.3s ease",
    },
}));

export default function StreamCard({title}) {
    return (
        <CardContainer>
            <CardMedia
                component="img"
                height='140px' // Ajusta el tamaño según la pantalla
                image="/urjc.jpeg"
                alt="Stream Thumbnail"
            />
            <GradientOverlay className="overlay" />
            <Box
                sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Chip
                    icon={<LiveTvIcon />}
                    label="LIVE"
                    color="error"
                    sx={{
                        fontWeight: "bold",
                        boxShadow: "0px 0px 8px rgba(255, 0, 0, 0.5)",
                        animation: "pulse 1s infinite",
                    }}
                />
            </Box>
            <CardContent>
                <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{
                        fontWeight: "bold",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        transition: "color 0.3s",
                        "&:hover": {
                            color: "primary.main",
                        },
                    }}
                >
                    Some brief description of the stream...
                </Typography>
            </CardContent>
        </CardContainer>
    );
}
