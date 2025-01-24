import Carousel from "./Carousel"
import Main from "../layouts/Main";
import StreamGrid from "./StreamGrid";
// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { selectConfig } from "../../slices/configSlice";
// import { fetchStreamsData } from "../../slices/streamsSlice";
// import { fetchCarouselData } from "../../slices/carouselSlice"
// import { fetchThumbnailsData } from "../../slices/thumbnailsSlice";
import { useGetStreamsQuery, useGetThumbnailsQuery } from "../../api/streamsApi";


function Home() {
  // const dispatch = useDispatch();
  // const { serverHost } = useSelector(selectConfig);
  // useEffect(() => {
  //   dispatch(fetchCarouselData(serverHost));
  //   dispatch(fetchStreamsData(serverHost));
  //   dispatch(fetchThumbnailsData(serverHost));

  // }, [dispatch, serverHost]);
  const { data: streamsData, isLoading: streamsLoading} = useGetStreamsQuery();
  // Definir el parámetro de nombres de streams para los thumbnails
  console.log(streamsData)
  const streamNames = streamsData ? streamsData.map((stream) => stream.stream_name) : [];
  // Llamada a la API de thumbnails pasando los nombres de los streams
  const { data: thumbnails, isLoading: thumbnailsLoading } = useGetThumbnailsQuery(streamNames, {
    skip: !streamNames.length, // Solo hacer la llamada si streamNames no está vacío
  });

  if (streamsLoading || thumbnailsLoading) return <p>Loading...</p>;

  return (
    <>
      <Main className="content p5">
        <Carousel thumbnails={thumbnails} ></Carousel>
        <p sx={{ marginBottom: 2 }}>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
          eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
          neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
          tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
          sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
          tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
          gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
          et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
          tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </p>
        <StreamGrid streamsData={streamsData} thumbnails={thumbnails} />
      </Main>
    </>

  );
}


export default Home;