import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGetWeather } from "../../features";
import { useDispatch, useSelector } from "react-redux";
import { updateInfo } from "../../entities";
import { format } from "date-fns";
import type { RootState } from "../../app/store";
import type { IDefaultCity } from "../../shared";

export type LocationType = {
  latitude: number | null;
  longitude: number | null;
};
interface ITodayInfo {
  temperature: number;
  cityName: string;
  icon: any;
}

const HomePage = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [todayInfom, settodayInfo] = useState<ITodayInfo>({
    temperature: 0,
    cityName: "",
    icon: null,
  });
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        toast.error("Permission denied or location unavailable");
        console.log(err);
      }
    );
  }, []);

  useEffect(() => {
    const json = localStorage.getItem("defaultCity");

    if (json) {
      const defaultCity: IDefaultCity = JSON.parse(json);
      dispatch(updateInfo(defaultCity));
    }
    setIsLocalStorageLoaded(true);
  }, [dispatch]);

  useEffect(() => {
    if (isLocalStorageLoaded && location) {
      dispatch(updateInfo(location));
    }
  }, [isLocalStorageLoaded, location, dispatch]);

  const slector: LocationType[] = useSelector(
    (store: RootState) => store.weather.weather
  );

  const { data } = useGetWeather(
    slector[0]?.latitude ?? 0,
    slector[0]?.longitude ?? 0,
    slector.length > 0
  );

  useEffect(() => {
    if (data) {
      const temperature = Math.round(data.list[0].main.temp);
      const cityName = data.city.name;
      const icon = data.list[0].weather[0].icon;
      settodayInfo({
        temperature: temperature,
        cityName: cityName,
        icon: icon,
      });
    }
  }, [data]);

  const now = new Date();
  const day = format(now, "EEEE");
  const shortDate = format(now, "d MMM ''yy");

  useEffect(() => {
    const interval = setInterval(() => {
      if (data) {
        const timezoneOffset = data.city.timezone;
        const utcNow =
          new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        const cityTime = new Date(utcNow + timezoneOffset * 1000);
        const formatted = format(cityTime, "HH:mm:ss");
        setCurrentTime(formatted);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="h-[200px] md:h-full md:p-16 flex items-end">
      <div className="flex items-center md:gap-5">
        <div>
          <h2 className="text-[60px] md:text-[130px]">
            {todayInfom.temperature}°
          </h2>
        </div>
        <div >
          <h3 className="text-[30px] md:text-[69px] tracking-wider leading-[1] md:leading-[1.3]">
            {todayInfom.cityName}
          </h3>
          <p className="text-[10px] md:text-[16px] whitespace-nowrap m-0">
            {currentTime} - {day}, {shortDate}
          </p>
        </div>
        <div>
          <img
            src={`https://openweathermap.org/img/wn/${todayInfom.icon}@4x.png`}
            alt="this icon"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
