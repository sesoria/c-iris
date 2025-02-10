import React, { useEffect, useRef, useState } from "react";
import ReactHlsPlayer from "react-hls-video-player";
import { useSelector } from "react-redux";

const Stream = ({ url, streamName }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const detections = useSelector((state) =>
    (state.detections.streams && state.detections.streams[streamName]) || []
  );

  const [baseline, setBaseline] = useState(null);
  const [currentDetections, setCurrentDetections] = useState([]);

  // Usamos loadeddata en vez de play
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      // Establecemos el baseline cuando los datos están listos
      const newBaseline = Date.now() / 1000 - video.currentTime;
      setBaseline(newBaseline - 2);
      console.log("Nuevo baseline (segundos):", newBaseline);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    return () => video.removeEventListener("loadeddata", handleLoadedData);
  }, []);

  useEffect(() => {
    if (!videoRef.current || baseline === null) return;

    const updateDetections = () => {
      const videoTime = videoRef.current.currentTime;
      const threshold = 1;

      const matchingDetections = detections
        .filter((detection) => {
          const detectionRelativeTime = detection.timestamp - baseline;
          console.log(
            `detection.timestamp: ${detection.timestamp}, baseline: ${baseline}, detectionRelativeTime: ${detectionRelativeTime}, videoTime: ${videoTime}`
          );
          return Math.abs(detectionRelativeTime - videoTime) <= threshold;
        })
        .reduce((acc, detection) => [...acc, ...detection.labels], []);

      setCurrentDetections(matchingDetections);
    };

    const interval = setInterval(updateDetections, 500);
    return () => clearInterval(interval);
  }, [detections, baseline]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) return;
    const ctx = canvas.getContext("2d");

    const drawBoundingBoxes = () => {
      const video = videoRef.current;
      if (!video) return;

      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      currentDetections.forEach((detection) => {
        const { Bounding_box, Name, Confidence } = detection;

        const x = Bounding_box.Left * canvas.width;
        const y = Bounding_box.Top * canvas.height;
        const width = Bounding_box.Width * canvas.width;
        const height = Bounding_box.Height * canvas.height;

        const scaleFactor = 0.95;
        const newWidth = width * scaleFactor;
        const newHeight = height * scaleFactor;
        const newX = x + (width - newWidth) / 2;
        const newY = y + (height - newHeight) / 2;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(newX, newY, newWidth, newHeight);

        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(newX, newY - 20, newWidth, 20);
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText(`${Name} (${Confidence.toFixed(2)}%)`, newX + 5, newY - 5);
      });

      requestAnimationFrame(drawBoundingBoxes);
    };

    drawBoundingBoxes();
  }, [currentDetections]);

  return (
    <div style={{ position: "relative", width: "100%", height: "auto" }}>
      <ReactHlsPlayer
        playerRef={videoRef}
        src={url}
        controls
        width="100%"
        height="auto"
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default Stream;
