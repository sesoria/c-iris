import { createSlice } from '@reduxjs/toolkit';

const initialState = {  
  "timestamp": null,
  "fragment_number": null,
  labels: []
};

const detectionsSlice = createSlice({
  name: 'detections',
  initialState: initialState,
  reducers: {
    setData: (state, action) => {
      state.timestamp = action.payload.timestamp;
      state.fragment_number = action.payload.fragment_number;
      state.labels = action.payload.labels;
    },
  },
});

export default detectionsSlice.reducer;
export const { setData } = detectionsSlice.actions;
export const selectDetections = (state) => state.detections; 