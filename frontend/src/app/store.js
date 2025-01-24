import { configureStore } from '@reduxjs/toolkit';
import configReducer from '../slices/configSlice';
import carouselReducer from '../slices/carouselSlice';
import thumbnailsReducer from '../slices/thumbnailsSlice';
import streamsReducer from '../slices/streamsSlice';
import visitsReducer from '../slices/visitsSlice'
import { streamsApi } from '../api/streamsApi';

export const store = configureStore({
  reducer: {
    config: configReducer,
    streams: streamsReducer,
    carousel: carouselReducer,
    thumbnails: thumbnailsReducer,
    visits: visitsReducer,
    [streamsApi.reducerPath]: streamsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(streamsApi.middleware),
});
