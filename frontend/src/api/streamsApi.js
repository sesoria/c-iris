import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const streamsApi = createApi({
  
  reducerPath: 'streamsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://phvitrbi12.execute-api.eu-west-1.amazonaws.com/', // URL base de tu API HTTP
    prepareHeaders: (headers, { getState }) => {
      const { serverHost } = getState().config; // Accede al estado si es necesario
      if (serverHost) {
        headers.set('base-url', serverHost); // Header opcional
      }
      return headers;
    },
  }),
  
  endpoints: (builder) => ({
    
    getStreams: builder.query({
      query: () => '/get_streams_info',
      keepUnusedDataFor: 3600, // Mantener caché 1 hora
    }),
    
    getThumbnails: builder.query({
      query: (streamNames) => ({
        url: '/get_streams_thumbnails',
        method: 'POST',
        body: { streams: JSON.stringify(streamNames) },
      }),
      keepUnusedDataFor: 300, // Mantener caché 5 minutos
    
    }),
    getHlsStreamUrl: builder.query({
      query: (stream_name) => ({
        url: `/get_hls_url?stream_name=${stream_name}`,
      }),
      keepUnusedDataFor: 0, // Desactiva el caché para evitar datos obsoletos
    }),
  }),
});

export const { useGetStreamsQuery, useGetThumbnailsQuery, useGetHlsStreamUrlQuery } = streamsApi;
