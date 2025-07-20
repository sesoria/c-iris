import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addDetection } from "../slices/detectionsSlice";

export default function useWebSocket(streamName) {
    // wsRef.current = new WebSocket("ws://localhost:8765");
    // const ws = wsRef.current;

    // ws.onopen = () => console.log("WebSocket connected");

    // ws.onmessage = (event) => {
    //     const data = JSON.parse(event.data);

    //     if (
    //         typeof data === "object" &&
    //         data !== null &&
    //         data.timestamp &&
    //         Array.isArray(data.labels)
    //     ) {
    //         data.labels = data.labels.flat(); // Asegura que los labels sean un array plano
    //         console.log("Recibido:", data);

    //         dispatch(addDetection({
    //             stream_name: streamName,  // **Asegura que esta variable tenga el nombre correcto del stream**
    //             timestamp: data.timestamp,
    //             fragment_number: data.fragment_number,
    //             labels: data.labels
    //         }));
    //     } else {
    //         console.warn("Estructura de datos inválida:", data);
    //     }
    // };

    // ws.onerror = (error) => console.error("WebSocket error:", error);
    // ws.onclose = () => console.log("WebSocket disconnected");

    // return () => ws.close();



  const wsRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!streamName) return;

    const websocketUrl = `wss://uhqyaqtrqh.execute-api.eu-west-1.amazonaws.com/production/?stream_name=${streamName}`;
    // const websocketUrl = "ws://localhost:8765"
    wsRef.current = new WebSocket(websocketUrl);
    const ws = wsRef.current;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message === "Forbidden") {
          console.error("🚫 WebSocket prohibido, deteniendo reconexión.");
          ws.close(); // Cierra la conexión y evita reconectar
          return;
        }
    
        if (data.timestamp && Array.isArray(data.labels)) {
          data.labels = data.labels.flat(); // Asegura que los labels sean un array plano
          // console.log("📡 Recibido:", data);
          dispatch(addDetection({
            stream_name: streamName,
            timestamp: data.timestamp,
            fragment_number: data.fragment_number,
            labels: data.labels
          }));
        } else {
          console.warn("⚠️ Datos inválidos:", data);
        }
      } catch (error) {
        console.error("❌ Error procesando mensaje:", error);
      }
    };
    ws.onerror = (error) => console.error("❌ WebSocket error:", error);
    ws.onclose = () => {
      console.log("🔌 WebSocket disconnected");
      ws.send(JSON.stringify({ action: "disconnect", stream_name: streamName }));
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({ action: "disconnect", stream_name: streamName }));
        wsRef.current.close();
      }
    };
    
  }, [streamName, dispatch]);

  return wsRef;
}
