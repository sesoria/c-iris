import Carousel from "./Carousel"
import Main from "../layouts/Main";
import StreamGrid from "./StreamGrid";
import { useGetStreamsQuery, useGetThumbnailsQuery } from "../../api/streamsApi";
import CarouselSkeleton from "../skeletons/CarouselSkeleton";


function Home() {
  const { data: streamsData, isLoading: streamsLoading} = useGetStreamsQuery();
  const streamNames = streamsData ? streamsData.map((stream) => stream.stream_name) : [];
  const { data: thumbnails, isLoading: thumbnailsLoading } = useGetThumbnailsQuery(streamNames, {
    skip: !streamNames.length,
  });
  const isLoading = streamsLoading || thumbnailsLoading;

  console.log(streamsData)
  console.log(thumbnails)
  return (
    <>
      <Main className="content p5">
      {isLoading ? <CarouselSkeleton/> : <Carousel thumbnails={thumbnails}/>}
        <br></br>
        <p sx={{ marginBottom: 2, fontSize: '1.5em' }}>
         <a href="*" style={{ color: 'blue', textDecoration: 'none' }}>Live channels</a> on right now!
        </p>
        <hr />
        <br></br>
        <StreamGrid streamsData={streamsData} thumbnails={thumbnails} />
      </Main>
    </>

  );
}


export default Home;