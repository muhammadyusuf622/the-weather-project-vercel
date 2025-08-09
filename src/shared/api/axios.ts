import axios from 'axios';

export const customAxios = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});