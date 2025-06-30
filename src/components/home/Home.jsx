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
//   const isLoading = streamsLoading;
//   const thumbnails = [
//     {
//         "title": "camera_cinnado",
//         "cover": "https://c-iris.s3.amazonaws.com/thumbnails/camera_cinnado/camera_cinnado_2025-01-21_11-26-14.jpg?AWSAccessKeyId=ASIARS42JBCKNKEXO3B2&Signature=Io2LMp5jMGdJaBRcsE4oHxxY8hQ%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEMH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQCfM69eBudLdysiYA8lXeBaIt6FT8OHWNNVRX4xkCjmjAIgaEDvlYktk6t5pdvPPj472BbwKTXI1eYMbxP3KjV7kYgqhQMIuv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAFGgwxMDkzMDgzNDg1NjQiDOUHAqvNk439tNTI%2FCrZAqJxldNBdZyqpo9J3Z2KMBpZlOfEI1xA5gTR7FxuyTA9A4p3QAZMnynywEOoLuRmOnNy5cpjodL8umo0Fn%2BQylljNzGaZ9ZT7cptcbkzR5CBc5ENfNu33u34eU1yssDGPZUQys86OturQknGlyCerfFaI9uvPnbqr8NHC2e6QcEKgKNbLiYg0GzV6JcoAdEf3LtwlJWc92A0fVwxwgt%2BQCPyE6%2BBLeUHqiN%2Bo5%2BNEKIeD106zQRxDGmhV9KGH3n5fgrfuOBGSKKEHGG%2BwQclbaqYoiqnigOqyvmXZVpeXvo%2B25iLZLYLXQf53LsMymcgsKfjJJU7LauCbS5FR2qOqy%2BZEBl6cO2t%2FAaGW38e95YB%2BBCcBSVBninkscmDJh4cDPNy8gxwmx0%2FluPYxoOgQEQ4cJlZK31Pau%2BVhhaldnw8czy96KpDgZtKQZlOwglWomzkrqUY4ASg%2BjDPk4nDBjqeAXjgAoH%2BMahQnyCMt51wjREDkFuE8%2FCESs4hPXt8%2FuiTgE1S0BG6L%2Bwmkh689KSvrv4WmrTaXfkt5y6sy38MFEhqDog2GhA%2B%2BXqmlE6EESRwlbHr6%2BOUe0VzfiQohvWDXqAohGCj5gsNaRYlKEnftOoRwTL3Zbt8FIwsCEDQGPjokkRSl%2FjySrL52qFAvqAqrLENte3lfKZL8xDGsoaZ&Expires=1751276869"
//     },
//         {
//         "title": "camera_cinnado",
//         "cover": "https://c-iris.s3.amazonaws.com/thumbnails/camera_cinnado/camera_cinnado_2025-01-21_11-26-14.jpg?AWSAccessKeyId=ASIARS42JBCKNKEXO3B2&Signature=Io2LMp5jMGdJaBRcsE4oHxxY8hQ%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEMH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQCfM69eBudLdysiYA8lXeBaIt6FT8OHWNNVRX4xkCjmjAIgaEDvlYktk6t5pdvPPj472BbwKTXI1eYMbxP3KjV7kYgqhQMIuv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAFGgwxMDkzMDgzNDg1NjQiDOUHAqvNk439tNTI%2FCrZAqJxldNBdZyqpo9J3Z2KMBpZlOfEI1xA5gTR7FxuyTA9A4p3QAZMnynywEOoLuRmOnNy5cpjodL8umo0Fn%2BQylljNzGaZ9ZT7cptcbkzR5CBc5ENfNu33u34eU1yssDGPZUQys86OturQknGlyCerfFaI9uvPnbqr8NHC2e6QcEKgKNbLiYg0GzV6JcoAdEf3LtwlJWc92A0fVwxwgt%2BQCPyE6%2BBLeUHqiN%2Bo5%2BNEKIeD106zQRxDGmhV9KGH3n5fgrfuOBGSKKEHGG%2BwQclbaqYoiqnigOqyvmXZVpeXvo%2B25iLZLYLXQf53LsMymcgsKfjJJU7LauCbS5FR2qOqy%2BZEBl6cO2t%2FAaGW38e95YB%2BBCcBSVBninkscmDJh4cDPNy8gxwmx0%2FluPYxoOgQEQ4cJlZK31Pau%2BVhhaldnw8czy96KpDgZtKQZlOwglWomzkrqUY4ASg%2BjDPk4nDBjqeAXjgAoH%2BMahQnyCMt51wjREDkFuE8%2FCESs4hPXt8%2FuiTgE1S0BG6L%2Bwmkh689KSvrv4WmrTaXfkt5y6sy38MFEhqDog2GhA%2B%2BXqmlE6EESRwlbHr6%2BOUe0VzfiQohvWDXqAohGCj5gsNaRYlKEnftOoRwTL3Zbt8FIwsCEDQGPjokkRSl%2FjySrL52qFAvqAqrLENte3lfKZL8xDGsoaZ&Expires=1751276869"
//     },
//     {
//         "title": "camera_cinnado",
//         "cover": "https://c-iris.s3.amazonaws.com/thumbnails/camera_cinnado/camera_cinnado_2025-01-21_11-26-14.jpg?AWSAccessKeyId=ASIARS42JBCKNKEXO3B2&Signature=Io2LMp5jMGdJaBRcsE4oHxxY8hQ%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEMH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQCfM69eBudLdysiYA8lXeBaIt6FT8OHWNNVRX4xkCjmjAIgaEDvlYktk6t5pdvPPj472BbwKTXI1eYMbxP3KjV7kYgqhQMIuv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAFGgwxMDkzMDgzNDg1NjQiDOUHAqvNk439tNTI%2FCrZAqJxldNBdZyqpo9J3Z2KMBpZlOfEI1xA5gTR7FxuyTA9A4p3QAZMnynywEOoLuRmOnNy5cpjodL8umo0Fn%2BQylljNzGaZ9ZT7cptcbkzR5CBc5ENfNu33u34eU1yssDGPZUQys86OturQknGlyCerfFaI9uvPnbqr8NHC2e6QcEKgKNbLiYg0GzV6JcoAdEf3LtwlJWc92A0fVwxwgt%2BQCPyE6%2BBLeUHqiN%2Bo5%2BNEKIeD106zQRxDGmhV9KGH3n5fgrfuOBGSKKEHGG%2BwQclbaqYoiqnigOqyvmXZVpeXvo%2B25iLZLYLXQf53LsMymcgsKfjJJU7LauCbS5FR2qOqy%2BZEBl6cO2t%2FAaGW38e95YB%2BBCcBSVBninkscmDJh4cDPNy8gxwmx0%2FluPYxoOgQEQ4cJlZK31Pau%2BVhhaldnw8czy96KpDgZtKQZlOwglWomzkrqUY4ASg%2BjDPk4nDBjqeAXjgAoH%2BMahQnyCMt51wjREDkFuE8%2FCESs4hPXt8%2FuiTgE1S0BG6L%2Bwmkh689KSvrv4WmrTaXfkt5y6sy38MFEhqDog2GhA%2B%2BXqmlE6EESRwlbHr6%2BOUe0VzfiQohvWDXqAohGCj5gsNaRYlKEnftOoRwTL3Zbt8FIwsCEDQGPjokkRSl%2FjySrL52qFAvqAqrLENte3lfKZL8xDGsoaZ&Expires=1751276869"
//     }

// ]

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