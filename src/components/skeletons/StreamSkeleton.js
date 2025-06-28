import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

const StreamSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        padding: 2,
        gap: 2,
      }}
    >
      {/* Video Skeleton */}
      <Box sx={{ flex: 2 }}>
        <Skeleton variant="rectangular" width="100%" height="300px" />
        <Box
          sx={{
            position: "relative",
            top: "-180px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
        {/* Controls Skeleton */}
        <Box sx={{ marginTop: "-140px", height: "50px" }}>
          <Skeleton variant="rectangular" width="100%" height="50px" />
        </Box>
      </Box>

      {/* Timeline Skeleton */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <Skeleton variant="rectangular" width="100px" height="30px" sx={{ alignSelf: "flex-start" }} />
        <Stack direction="column" spacing={2}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Skeleton variant="circular" width={15} height={15} />
              <Skeleton variant="rectangular" width="70%" height={20} />
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default StreamSkeleton;
