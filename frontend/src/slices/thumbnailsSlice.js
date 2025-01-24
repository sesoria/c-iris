import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const DEFAULT_DATA = [
  { cover: "https://images6.alphacoders.com/679/thumb-1920-679459.jpg", title: "Interstellar"},
  { cover: "https://images2.alphacoders.com/851/thumb-1920-85182.jpg", title: "Inception"},
  { cover: "https://images6.alphacoders.com/875/thumb-1920-875570.jpg", title: "Blade Runner 2049"},
]

const initialState = {  
  data: [[],[],[]],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};



// Define el thunk para obtener los datos del carrusel
export const fetchThumbnailsData = createAsyncThunk(
  'thumbnails/fetchData', // Nombre del thunk
  async (serverHost, { rejectWithValue }) => {
    try {
      const response = await fetch(`${serverHost}/get_thumbnails`);
      if (!response.ok) {
        throw new Error('Failed to fetch thumbnails data');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message); // Manejo de errores
    }
  }
);

const thumbnailsSlice = createSlice({
  name: 'thumbnails',
  initialState: initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThumbnailsData.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Limpiar errores anteriores
      })
      .addCase(fetchThumbnailsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload; // Guardar los datos obtenidos
      })
      .addCase(fetchThumbnailsData.rejected, (state, action) => {
        state.status = 'failed';
        state.data = DEFAULT_DATA
        state.error = action.payload; // Guardar el error recibido
      });
  },
});

export default thumbnailsSlice.reducer;
export const selectThumbnails = (state) => state.thumbnails; 