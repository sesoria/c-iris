import React, { useEffect, useRef } from "react";
import ReactHlsPlayer from "react-hls-video-player";
import { useSelector } from "react-redux";
import { selectDetections } from "../../slices/detectionsSlice";

const Stream = ({ url }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const detections = useSelector(selectDetections);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const drawBoundingBoxes = () => {
            if (!canvas || !ctx || !videoRef.current) return;

            const video = videoRef.current;
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            detections.labels.flat().forEach((detection) => {
                const { Bounding_box, Name, Confidence } = detection;
                
                // Coordenadas originales
                const x = Bounding_box.Left * canvas.width;
                const y = Bounding_box.Top * canvas.height;
                const width = Bounding_box.Width * canvas.width;
                const height = Bounding_box.Height * canvas.height;

                // Reducir tamaño de la caja (95% del original)
                const scaleFactor = 0.95; 
                const newWidth = width * scaleFactor;
                const newHeight = height * scaleFactor;

                // Ajustar posición para mantener centrado
                const newX = x + (width - newWidth) / 2;
                const newY = y + (height - newHeight) / 2;

                // Dibujar bounding box
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.strokeRect(newX, newY, newWidth, newHeight);

                // Dibujar etiqueta
                ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                ctx.fillRect(newX, newY - 20, newWidth, 20);
                ctx.fillStyle = "white";
                ctx.font = "14px Arial";
                ctx.fillText(`${Name} (${Confidence.toFixed(2)}%)`, newX + 5, newY - 5);
            });

            requestAnimationFrame(drawBoundingBoxes);
        };

        drawBoundingBoxes();
    }, [detections]);

    return (
        <div style={{ position: "relative", width: "100%", height: "auto" }}>
            {/* Video */}
            <ReactHlsPlayer
                playerRef={videoRef}
                src={url}
                controls
                width="100%"
                height="auto"
            />

            {/* Canvas para bounding boxes */}
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
