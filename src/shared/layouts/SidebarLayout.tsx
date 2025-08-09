import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  CloudyIconComponents,
  HumanityIconComponents,
  SidebarLump,
  TempMaxIconComponents,
  TempMinIconComponents,
  useGetWeather,
  WindIconComponents,
} from "../../features";
import type { LocationType } from "../../pages/Home";
import { useDebaunce } from "../lib";
import type { IDarkMoon, IWeatherItem } from "../types";
import type { WeatherData } from "../api/openweather/types";
import { countryCapitals, type ICountryCapitals } from "../constants";
import { updateInfo } from "../../entities";

const SidebarLayout = () => {
  const weatherInfo: LocationType[] = useSelector(
    (store: RootState) => store.weather.weather
  );
  const darkMoon: boolean = useSelector(
    (store: RootState) => store.weather.darkMode
  );
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebaunce(search, 500);
  const [weathers, setWeathers] = useState<IWeatherItem[]>([]);
  const [searchOptions, setSearchOptions] = useState<ICountryCapitals[]>([]);
  const [localDark, setlocalDark] = useState<boolean>(true);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const countryData = countryCapitals;

  const { data } = useGetWeather(
    weatherInfo[0]?.latitude ?? 0,
    weatherInfo[0]?.longitude ?? 0,
    weatherInfo.length > 0
  );

  useEffect(() => {
    const json = localStorage.getItem("darkMoon");
    if (json) {
      const check: IDarkMoon = JSON.parse(json);
      setlocalDark(check.darkMoon);
    }
  }, [darkMoon]);

  useEffect(() => {
    if (debouncedSearch) {
      const foundedCountres = countryData.filter(
        (item) =>
          item.capital
            .toLowerCase()
            .startsWith(debouncedSearch.toLowerCase()) ||
          item.country.toLowerCase().startsWith(debouncedSearch.toLowerCase())
      );
      setSearchOptions(foundedCountres);
    } else {
      setSearchOptions([]);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (data) {
      const checkDate: string[] = [];
      const filteredWeather: IWeatherItem[] = [];

      data.list.forEach((item: WeatherData, index: number) => {
        const check = item.dt_txt.split(" ")[0];
        const dayOfWeek = new Date(item.dt_txt).toLocaleDateString("en-US", {
          weekday: "long",
        });
        if (!checkDate.includes(check)) {
          checkDate.push(check);
          filteredWeather.push({
            id: index,
            day: dayOfWeek,
            dt: item.dt,
            dt_txt: item.dt_txt,
            temp_max: Math.floor(item.main.temp_max),
            temp_min: Math.floor(item.main.temp_min),
            humidity: item.main.humidity,
            clouds: item.clouds.all,
            wind: Math.round(item.wind.speed * 3.6),
          });
        }
      });

      setWeathers(filteredWeather);
    }
  }, [data]);

  function handleClick(name: string) {
    const findCountry = countryData.find(
      (item) => item.capital.toLowerCase() === name.toLowerCase()
    );
    if (findCountry) {
      const location = {
        latitude: findCountry.lat,
        longitude: findCountry.lon,
      };
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setSearchOptions([]);
      dispatch(updateInfo(location));
    }
  }

  return (
    <div
      className={`${
        localDark ? "bg-white/10" : "bg-black/10"
      }  backdrop-blur-[5px] w-full md:w-[550px] h-[90vh] md:h-[100vh] border-r-5 border-white/20 p-4 text-white overflow-hidden transition-colors duration-1000 ease-in-out `}
    >
      <div className="w-[80%] m-auto">
        <div className="relative mt-15 w-full md:block hidden">
          <label className="absolute right-5">
            <SidebarLump />
          </label>
          <input
            className="w-full border-b-2 border-white pb-2 text-[20px] focus:outline-none focus:ring-0 focus:border-white"
            placeholder="Search Location..."
            type="text"
            ref={inputRef}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />

          <div
            style={{
              display: searchOptions[0] ? "block" : "none",
              // scrollbarWidth: "none",
            }}
            className="absolute top-15 bg-black/60 backdrop-blur-[5px] p-2 w-full text-[20px] rounded max-h-[calc(100vh-150px)] overflow-y-auto custom-scroll "
          >
            {searchOptions?.map((item, index) => (
              <p
                key={index}
                onClick={() => handleClick(item.capital)}
                className="border-white border-b-1 mt-3 cursor-pointer"
              >
                {item.capital}
              </p>
            ))}
          </div>
        </div>

        <div
          style={{ scrollbarWidth: "none" }}
          className="mt-10 md:mt-20 max-h-[calc(100vh-150px)] overflow-y-auto pr-2"
        >
          {weathers?.map((item) => {
            return (
              <div key={item.id} className="flex flex-col gap-4 text-1xl">
                <h2 className="text-4xl text-center md:text-start">{item.day}</h2>
                <div className="flex justify-between items-center">
                  <span>Temp max</span>
                  <span className="flex gap-3">
                    {item.temp_max}
                    <TempMaxIconComponents />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Temp min</span>
                  <span className="flex gap-3 items-center">
                    {item.temp_min}
                    <TempMinIconComponents />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Humadity</span>
                  <span className="flex gap-3 items-center">
                    {item.humidity}
                    <HumanityIconComponents />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cloudy</span>
                  <span className="flex gap-3 items-center">
                    {item.clouds}
                    <CloudyIconComponents />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Wind</span>
                  <span className="flex gap-3 items-center">
                    {item.wind}km/h
                    <WindIconComponents />
                  </span>
                </div>
                <hr className="border-white border-1 mt-10 mb-5" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
