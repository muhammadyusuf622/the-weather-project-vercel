import { createSlice } from "@reduxjs/toolkit";


const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    weather: [{ latitude: null, longitude: null }],
    darkMode: true,
  },
  reducers: {
    updateInfo: (state, action) => {
      state.weather = [action.payload];
    },

    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});


export const { updateInfo, toggleDarkMode } = weatherSlice.actions;
export default weatherSlice.reducer;