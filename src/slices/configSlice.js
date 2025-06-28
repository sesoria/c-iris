import { createSlice } from "@reduxjs/toolkit";

const initialState = {  
  serverHost: "https://phvitrbi12.execute-api.eu-west-1.amazonaws.com/",
  // serverHost: "http://localhost:8000",
  theme: "dark"
};

function clearLocalStorage(prefix) {
  for (const key of  Object.keys(localStorage)) {
    if (key.startsWith(prefix)) localStorage.removeItem(key);
  }
}

// Get config from local storage if exists
const storedConfig = JSON.parse(localStorage.getItem('config'));
const initialConfig = storedConfig ? { ...initialState, ...storedConfig } : initialState;
clearLocalStorage('prefix')

export const configSlice = createSlice({
  name: "config",
  initialState: initialConfig,
  reducers: {
    setConfig: (state, action) => {
      const newConfig = {
        ...state,
        ...action.payload
      };
      localStorage.setItem('config', JSON.stringify(newConfig));
      return newConfig;
    },
    restartConfig: () => {
      localStorage.removeItem('config');
      return initialState;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  }
});


export const { setConfig, restartConfig, setTheme } = configSlice.actions;
export const selectConfig = (state) => state.config;
export default configSlice.reducer;