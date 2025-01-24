import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
import { Fab, Skeleton } from "@mui/material";
import { StackedCarousel, ResponsiveContainer } from "react-stacked-center-carousel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { selectThumbnails } from "../../slices/thumbnailsSlice";



export default function Carousel({ thumbnails }) {
    const ref = React.useRef();
    // const { data } = useSelector(selectThumbnails);
    console.log(thumbnails)
    return (
        <div style={{ width: "100%", position: "relative" }}>
            <ResponsiveContainer
                carouselRef={ref}
                render={(parentWidth, carouselRef) => {
                    let currentVisibleSlide = 5;
                    if (parentWidth <= 1440) currentVisibleSlide = 3;
                    if (parentWidth <= 1080) currentVisibleSlide = 1;
                    return (
                        <StackedCarousel
                            ref={carouselRef}
                            slideComponent={Card}
                            slideWidth={parentWidth < 800 ? parentWidth - 40 : 750}
                            carouselWidth={parentWidth}
                            data={thumbnails}
                            currentVisibleSlide={currentVisibleSlide}
                            maxVisibleSlide={5}
                            useGrabCursor
                        />
                    );
                }}
            />
            <>
                <Fab
                    style={{ position: "absolute", top: "40%", left: 20, zIndex: 10 }}
                    size="small"
                    color="primary"
                    onClick={() => ref.current?.goBack()}
                >
                    <ArrowBackIcon />
                </Fab>
                <Fab
                    style={{ position: "absolute", top: "40%", right: 20, zIndex: 10 }}
                    size="small"
                    color="primary"
                    onClick={() => ref.current?.goNext(6)}
                >
                    <ArrowForwardIcon />
                </Fab>
            </>
        </div>
    );
}

export const Card = React.memo(function (props) {
    const { data, dataIndex } = props;
    const { cover, title } = data[dataIndex];
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [loaded, setLoaded] = useState(false); // Estado para verificar si la imagen ha cargado

    // Maneja el clic solo si no ha habido arrastre
    const handleClick = () => {
        if (!isDragging) {
            navigate(`/streams/${title}`, {state: { stream_name: title }});
        }
    };

    return (
        <div
            style={{
                width: "100%",
                height: 300,
                userSelect: "none",
                cursor: "pointer",
                position: "relative", // Necesario para colocar el esqueleto encima de la imagen
            }}
            className="my-slide-component"
            onMouseDown={() => setIsDragging(false)}
            onMouseMove={() => setIsDragging(true)}
            onMouseUp={handleClick}
        >
            {/* Mostrar Skeleton mientras la imagen se carga */}
            {!loaded && (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                />
            )}
            {/* Imagen */}
            <img
                style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 0,
                    opacity: loaded ? 1 : 0, // Cambiar la opacidad
                    transition: "opacity 0.5s ease-in-out", // Efecto de transición suave
                    position: "absolute", // Mantener la imagen en el mismo lugar que el Skeleton
                    top: 0,
                    left: 0,
                }}
                draggable={false}
                src={cover}
                alt={title}
                onLoad={() => setLoaded(true)} // Cambiar el estado a true cuando la imagen termine de cargar
            />
        </div>
    );
});
