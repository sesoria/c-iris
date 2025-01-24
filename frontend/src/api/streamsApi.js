import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const streamsApi = createApi({
  reducerPath: 'streamsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://phvitrbi12.execute-api.eu-west-1.amazonaws.com/', // Inicialmente vacío, se configurará dinámicamente.
    prepareHeaders: (headers, { getState }) => {
      const { serverHost } = getState().config; // Accede al estado directamente
      if (serverHost) {
        headers.set('base-url', serverHost); // Opcional, si necesitas custom headers
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStreams: builder.query({
      query: () => '/get_streams_info', // Endpoint para streams
      keepUnusedDataFor: 3600, // Mantener los datos en caché durante 1 hora (en segundos)
    }),
    getThumbnails: builder.query({
      query: (streamNames) => ({
        url: '/get_streams_thumbnails',
        method: 'POST', // Cambiamos el método a POST
        body: { streams: JSON.stringify(streamNames) }, // Serializar el array como JSON
      }),
      keepUnusedDataFor: 300, // Mantener los datos en caché durante 5 minutos (en segundos)
    }),
  }),
});

export const { useGetStreamsQuery, useGetThumbnailsQuery } = streamsApi;
