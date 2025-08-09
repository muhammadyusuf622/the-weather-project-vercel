import { useQuery } from "@tanstack/react-query"
import { getWeather } from "../../../../shared"


export const useGetWeather = (lat: number, lon: number, enabled: boolean = true) => {
  return useQuery({
    queryFn: () => getWeather(lat, lon),
    queryKey: ["weathers", lat, lon],
    staleTime: 1000 * 60 * 5,
    enabled: enabled,
  });
};