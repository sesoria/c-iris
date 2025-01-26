import { useState, Suspense, lazy, useEffect } from "react";
import { Grid2, Button, Box, Skeleton, useMediaQuery, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

const StreamCard = lazy(() => import("./StreamCard")); // Lazy load del componente

const StreamGrid = ({ streamsData, thumbnails }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const initialVisibleCount = isSmallScreen ? 2 : 3;
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  useEffect(() => {
    setVisibleCount(initialVisibleCount);
  }, [initialVisibleCount]);

  const showMoreItems = () => {
    if (visibleCount >= streamsData.length) return;

    setVisibleCount((prevCount) => {
      if (prevCount % 3 === 0) return prevCount + 3;
      if (prevCount % 2 === 0) return prevCount + 2;
      return prevCount + 2;
    });
  };

  const isLoading = !streamsData || !thumbnails; // Condición para mostrar Skeletons

  return (
    <Box>
      <Grid2 container display={'flex'}>
        {(isLoading
          ? Array.from(new Array(visibleCount)) // Placeholder Skeletons mientras carga
          : streamsData.slice(0, visibleCount)
        ).map((stream, index) => (
          <Grid2
            size={{
              xs:12,
              sm:6,
              md:4,
              lg:4,
            }}
            key={index}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                height={200} // Altura aproximada de la card
                animation="wave"
                sx={{ borderRadius: "8px" }}
              />
            ) : (
              <Link
                to={`/streams/${stream.stream_name}`}
                state={{ streamName: stream.stream_name }}
                style={{ textDecoration: "none" }}
              >
                <Suspense fallback={<CircularProgress />}>
                  <StreamCard title={stream.stream_name} />
                </Suspense>
              </Link>
            )}
          </Grid2>
        ))}
      </Grid2>

      {visibleCount < streamsData?.length && (
        <Box mt={3} display="flex" justifyContent="center">
          <Button variant="contained" onClick={showMoreItems}>
            Mostrar más
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default StreamGrid;
