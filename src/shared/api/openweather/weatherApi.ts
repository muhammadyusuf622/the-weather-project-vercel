import { customAxios } from "../axios";
import type { WeatherResponse } from "./types";

export const getWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
  try {
    const res = await customAxios.get("/forecast", {
      params: {
        lat,
        lon,
        appid: "a1160770cd34edbda442bb5f80fc70a2",
        units: "metric",
      },
    });
    return res.data;
  } catch (error) {
    console.error("getWeather api error", error);
    throw error;
  }
};