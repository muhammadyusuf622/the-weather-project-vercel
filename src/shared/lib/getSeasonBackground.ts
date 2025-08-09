import backgroundWinter from "../assets/images/background1.svg";
import backgroundSummer from "../assets/images/pexels-quang-nguyen-vinh-222549-10615224.jpg";
import backgroundFall from "../assets/images/pexels-pixabay-33109.jpg";
import backgroundSpring from "../assets/images/pexels-david-bartus-43782-1166209.jpg";
import backgroundRain from "../assets/images/valentin-muller-bWtd1ZyEy6w-unsplash.jpg";
import backgroundCloudy from "../assets/images/christian-keybets-GWKdpVw4tYc-unsplash.jpg";
import backgroundWind from "../assets/images/ChatGPT Image Aug 9, 2025, 11_55_16 PM.png";
import backgroundNight from "../assets/images/matt-quinn-g0q8PpjCZRA-unsplash.jpg";

import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import type { LocationType } from "../../pages/Home";
import { useGetWeather } from "../../features";
import { useEffect, useState } from "react";

export const useWeatherBackground = () => {
  const weatherInfo: LocationType[] = useSelector(
    (store: RootState) => store.weather.weather
  );

  const { data } = useGetWeather(
    weatherInfo[0]?.latitude ?? 0,
    weatherInfo[0]?.longitude ?? 0,
    weatherInfo.length > 0
  );

  const [background, setBackground] = useState<string>(backgroundSummer);

  useEffect(() => {
    if (!data) return;

    console.log(data)
    const weatherItem = data.list[0];
    const weatherMain = weatherItem.weather[0].main.toLowerCase();
    const isNight = weatherItem.sys.pod === "n";

    // Shamol tezligi (speed) va yo'nalishi (deg)
    const windSpeed = weatherItem.wind.speed;

    // Bulut qamrovi (clouds.all)
    const cloudiness = weatherItem.clouds.all;

    // Fon rasm tanlash qoidalari:
    if (
      weatherMain.includes("rain") ||
      weatherMain.includes("drizzle") ||
      weatherMain.includes("thunderstorm")
    ) {
      setBackground(backgroundRain);
    } else if (cloudiness >= 50) {
      setBackground(backgroundCloudy);
    } else if (weatherMain.includes("cloud")) {
      setBackground(backgroundCloudy);
    } else if (windSpeed > 6) {
      // Shamol kuchi 6 m/s dan katta bo'lsa shamol rasmi
      setBackground(backgroundWind);
    } else if (isNight) {
      setBackground(backgroundNight);
    } else {
      // Agar yuqoridagilar bo'lmasa, faslga qarab fon
      const month = new Date().getMonth();
      if (month >= 2 && month <= 4) {
        setBackground(backgroundSpring);
      } else if (month >= 5 && month <= 7) {
        setBackground(backgroundSummer);
      } else if (month >= 8 && month <= 10) {
        setBackground(backgroundFall);
      } else {
        setBackground(backgroundWinter);
      }
    }
  }, [data]);

  return background;
};
