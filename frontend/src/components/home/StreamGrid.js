import { useState, Suspense, lazy, useEffect } from "react";
import { Grid2, Button, Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectStreams } from "../../slices/streamsSlice";
const StreamCard = lazy(() => import("./StreamCard")); // Lazy load del componente



const StreamGrid = ( { streamsData, thumbnails } ) => {
    // const { data } = useSelector(selectStreams);


    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    // const isSmallScreen = false;
    
    // Número inicial de elementos visibles según el tamaño de la pantalla
    const initialVisibleCount = isSmallScreen ? 2 : 3;
    const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
    
    // Actualizar el número visible inicial cuando el tamaño de pantalla cambia
    useEffect(() => {
        setVisibleCount(initialVisibleCount);
    }, [initialVisibleCount]);
    
    
    // Función para cargar más elementos
    const showMoreItems = () => {
        if (visibleCount >= streamsData.length) return; // Si no hay más elementos, no hacer nada
    
        // Incrementa el conteo visible en función de la cantidad de elementos visibles actual
        setVisibleCount(prevCount => {
            if (prevCount % 3 === 0) return prevCount + 3;
            if (prevCount % 2 === 0) return prevCount + 2;
            return prevCount + 2;
        });
    };

  return (
    <Box>
      <Grid2 container display={'flex'}>
        {streamsData.slice(0, visibleCount).map((stream, index) => (
          <Grid2
          size={{
              xs:12,
              sm:6,
              md:4,
              lg:4,
            }}
              key={index}
              >
              <Link to={`/streams/${stream.stream_name}`} state={{ streamName: stream.stream_name }} style={{ textDecoration: 'none' }}>
                  <Suspense fallback={<CircularProgress />}>
                      <StreamCard title={stream.stream_name} />
                  </Suspense>
              </Link>
          </Grid2>
        ))}
      </Grid2>

      {visibleCount < streamsData.length && (
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
