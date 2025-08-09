import type { RootState } from "../../../app/store";

export const selectorWeather = (state: RootState) => state.weather.weather;
export const selectorDarkMoon = (state: RootState) => state.weather.darkMode;