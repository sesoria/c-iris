import { configureStore } from '@reduxjs/toolkit';
import configReducer from '../slices/configSlice';
import detectionsReducer from '../slices/detectionsSlice';
import { streamsApi } from '../api/streamsApi';

export const store = configureStore({
  reducer: {
    config: configReducer,
    detections: detectionsReducer,
    [streamsApi.reducerPath]: streamsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(streamsApi.middleware),
});
