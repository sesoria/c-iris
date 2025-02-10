import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    streams: {} // Clave: stream_name, Valor: Array de detecciones
};

const detectionsSlice = createSlice({
    name: "detections",
    initialState,
    reducers: {
        addDetection: (state, action) => {
            const { stream_name, timestamp, fragment_number, labels } = action.payload;

            if (!state.streams[stream_name]) {
                state.streams[stream_name] = [];
            }

            // Verifica si la detección ya existe (evita duplicados)
            const exists = state.streams[stream_name].some(
                (detection) => detection.fragment_number === fragment_number
            );

            if (!exists) {
                state.streams[stream_name].unshift({
                    timestamp,
                    fragment_number,
                    labels,
                });

                // Opcional: mantener solo las últimas N detecciones para evitar crecimiento infinito
                if (state.streams[stream_name].length > 10) {
                    state.streams[stream_name].pop(); // Elimina la más antigua
                }
            }
        },

        clearDetectionsForStream: (state, action) => {
            const { stream_name } = action.payload;
            if (state.streams[stream_name]) {
                state.streams[stream_name] = [];
            }
        }
    }
});

// **Selectores**
export const selectDetectionsForTimestamp = (state, streamName, currentTime) => {
    const streamDetections = state.detections.streams[streamName] || [];
    
    // Filtra detecciones cuyo timestamp es cercano al currentTime
    return streamDetections.filter(
        (detection) => Math.floor(detection.timestamp) === currentTime
    );
};

export const { addDetection, clearDetectionsForStream } = detectionsSlice.actions;
export default detectionsSlice.reducer;
export const selectDetections = (state) => state.detections; 