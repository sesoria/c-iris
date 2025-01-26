import Carousel from "./Carousel"
import Main from "../layouts/Main";
import StreamGrid from "./StreamGrid";
import { useGetStreamsQuery, useGetThumbnailsQuery } from "../../api/streamsApi";
import CarouselSkeleton from "../skeletons/CarouselSkeleton";


function Home() {
  const { data: streamsData, isLoading: streamsLoading} = useGetStreamsQuery();
  const streamNames = streamsData ? streamsData.map((stream) => stream.stream_name) : [];
  const { data: thumbnails, isLoading: thumbnailsLoading } = useGetThumbnailsQuery(streamNames, {
    skip: !streamNames.length, // Solo hacer la llamada si streamNames no está vacío
  });
  const isLoading = streamsLoading || thumbnailsLoading;

  return (
    <>
      <Main className="content p5">
      {isLoading ? <CarouselSkeleton/> : <Carousel thumbnails={thumbnails}/>}
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