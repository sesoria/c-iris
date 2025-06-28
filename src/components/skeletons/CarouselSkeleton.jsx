import React from "react";
import { Skeleton, Box, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const CarouselSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Flecha izquierda */}
      <IconButton>
        <ArrowBack />
      </IconButton>

      {/* Contenedor central para imágenes */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          gap: 2,
          overflow: "hidden",
          padding: "0 16px",
        }}
      >
        {/* Imagen izquierda */}
        <Skeleton
          variant="rectangular"
          width="300px"
          height="250px"
          animation="wave"
        />
        {/* Imagen central */}
        <Skeleton
          variant="rectangular"
          width="300px"
          height="300px"
          animation="wave"
        />
        {/* Imagen derecha */}
        <Skeleton
          variant="rectangular"
          width="300px"
          height="250px"
          animation="wave"
        />
      </Box>

      {/* Flecha derecha */}
      <IconButton>
        <ArrowForward />
      </IconButton>
    </Box>
  );
};

export default CarouselSkeleton;
