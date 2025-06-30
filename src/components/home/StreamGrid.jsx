import { useState, Suspense, lazy, useEffect } from "react";
import { Grid, Button, Box, Skeleton, useMediaQuery, CircularProgress } from "@mui/material";
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
      <Grid container display={'flex'} rowSpacing={6} columnSpacing={10}>
        {(isLoading
          ? Array.from(new Array(visibleCount)) // Placeholder Skeletons mientras carga
          : streamsData.slice(0, visibleCount)
        ).map((stream, index) => (
          <Grid
            size={{
              xs:12,
              sm:6,
              md:4,
              lg:4,
            }}
            key={index}
            rowSpacing={6}
            columnSpacing={10}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                height={250} // Altura aproximada de la card
                animation="wave"
                sx={{ borderRadius: "8px" }}
              />
            ) : (
              <Link
                to={`/streams/${stream.stream_name}`}
                state={{ streamName: stream.stream_name }}
                style={{ textDecoration: "none" }}
              >
                <Suspense fallback={<CircularProgress sx={{ display: 'block', margin: '0 auto' }}/>}>
                  <StreamCard title={stream.stream_name} imageUrl={thumbnails[index].cover}/>
                </Suspense>
              </Link>
            )}
          </Grid>
        ))}
      </Grid>

      {visibleCount < streamsData?.length && (
        <Box mt={3} display="flex" justifyContent="center">
          {isLoading ? 
            <Skeleton
              variant="rectangular"
              height={36.5} // Altura aproximada de la card
              width={139.9}
              animation="wave"
              sx={{ borderRadius: "8px" }}
            />
            :
            <Button variant="contained" onClick={showMoreItems}>
              Mostrar más
            </Button>
          }
        </Box>
      )}
    </Box>
  );
};

export default StreamGrid;
