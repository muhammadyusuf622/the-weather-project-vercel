import { useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";
import { useDispatch } from "react-redux";
import {
  countryCapitals,
  useDebaunce,
  type ICountryCapitals,
  type IDarkMoon,
  type IDefaultCity,
} from "../../shared";
import { toggleDarkMode, updateInfo } from "../../entities";
import { SidebarLump } from "../../features";
import toast from "react-hot-toast";
import type { LocationType } from "../Home";

const SettingsPage = () => {
  const [isOn, setIsOn] = useState(true);
  const [localDark, setLocalDark] = useState<boolean>(true);
  const dispatch = useDispatch();
  const [searchOptions, setSearchOptions] = useState<ICountryCapitals[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState<LocationType | null>(null);
  const debouncedSearch = useDebaunce(search, 500);
  const countryData = countryCapitals;

  function getLocation() {
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
  }
  
  useEffect(() => {
    if (location) {
      dispatch(updateInfo(location));
    }
  }, [location, dispatch]);

  useEffect(() => {
    const json = localStorage.getItem("defaultCity");
    if (json) {
      const cityName: IDefaultCity = JSON.parse(json);
      if (inputRef.current) {
        inputRef.current.value = cityName.cityName || "";
      }
    }
  }, []);

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
      localStorage.removeItem("defaultCity");
      getLocation();
      setSearchOptions([]);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const json = localStorage.getItem("darkMoon");
    if (json) {
      const darkMoon: IDarkMoon = JSON.parse(json);
      setIsOn(darkMoon.darkMoon);
      setLocalDark(darkMoon.darkMoon);
    }
  }, []);

  const toggleSwitch = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    setLocalDark(newValue);
    localStorage.setItem("darkMoon", JSON.stringify({ darkMoon: newValue }));
    dispatch(toggleDarkMode());
  };

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
        inputRef.current.value = findCountry.capital;
        localStorage.setItem(
          "defaultCity",
          JSON.stringify({ ...location, cityName: findCountry.capital })
        );
      }
      setSearchOptions([]);
      dispatch(updateInfo(location));
    }
  }

  return (
    <div className="w-[95%] h-full mb-50 md:m-auto flex items-center m-auto ">
      <div
        className={`${
          localDark ? "bg-white/30" : "bg-black/30"
        } flex items-center  backdrop-blur-[5px] w-full h-[60%] pt-4 pb-4 rounded transition-colors duration-1000 ease-in-out`}
      >
        <div className="w-[90%] md:h-auto m-auto">
          <div
            className={`w-full flex ${
              localDark ? "bg-black/30" : "bg-white/30"
            } rounded  items-center justify-between border-white border-b-3 p-3 transition-colors duration-1000 ease-in-out overflow-hidden `}
          >
            <p className="text-[15px] md:text-[23px]">Darkmoon</p>
            <div>
              <motion.button
                className={`flex cursor-pointer rounded-full w-[50px] h-[25px] md:w-[60px] md:h-[30px]`}
                style={{
                  justifyContent: isOn ? "flex-start" : "flex-end",
                  alignItems: "center",
                  backgroundColor: isOn ? "black" : "white",
                  transition: "all 0.90s ease",
                }}
                onClick={toggleSwitch}
                layout
              >
                <motion.div
                  className={`w-[25px] h-[25px] md:w-[30px] md:h-[30px] ${
                    isOn ? "bg-white" : "bg-black"
                  } rounded-full`}
                  layout
                />
              </motion.button>
            </div>
          </div>
          <div
            className={`relative mt-8 md:mt-15 pt-3 pb-3 rounded border-b-3 ${
              localDark ? "bg-black/35" : "bg-white/30"
            } border-white  backdrop-blur-[5px] transition-colors duration-1000 ease-in-out`}
          >
            <label className="absolute right-5">
              <SidebarLump />
            </label>
            <input
              className="w-full pl-3 text-[15px] md:text-[20px] focus:outline-none focus:ring-0 focus:border-white"
              placeholder="Choose your default city..."
              type="text"
              ref={inputRef}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />

            <div
              style={{
                display: searchOptions[0] ? "block" : "none",
              }}
              className="absolute top-15 bg-black/60 backdrop-blur-[5px] p-5 w-full text-[20px] rounded max-h-[calc(40vh-150px)] md:max-h-[calc(30vh-150px)] overflow-y-auto custom-scroll "
            >
              {searchOptions?.map((item, index) => (
                <p
                  key={index}
                  onClick={() => handleClick(item.capital)}
                  className="border-white border-b-1 mt-1 cursor-pointer"
                >
                  {item.capital}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
