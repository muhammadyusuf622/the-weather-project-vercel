import { useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router";
import { SidebarLump } from "../../features";
import { countryCapitals, type ICountryCapitals } from "../constants";
import { useDispatch } from "react-redux";
import { updateInfo } from "../../entities";
import { useDebaunce } from "../lib";

const NavbarLayout = () => {
  const [rotate, setRotate] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebaunce(search, 500);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchOptions, setSearchOptions] = useState<ICountryCapitals[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const countryData = countryCapitals;

  useEffect(() => {
    const checkScreen = () => setIsSmall(window.innerWidth < 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
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
      setSearchOptions([]);
    }
  }, [debouncedSearch]);

  function handeClick() {
    setRotate(!rotate);
    setTimeout(() => {
      rotate ? navigate("/") : navigate("/settings");
    }, 1000);
  }

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
    <div className="bg-none px-6 py-5 w-full text-white flex items-center justify-between">
      <motion.div
        onClick={() => handeClick()}
        animate={rotate ? { rotate: 360 } : { rotate: 0 }}
        transition={{
          duration: 1,
          ease: [0.42, 0, 0.58, 1],
        }}
        className="cursor-pointer"
      >
        <Settings size={isSmall ? 28 : 32} />
      </motion.div>


      <div className="relative w-[60%] md:hidden block">
        <label className="absolute right-1 top-1">
          <SidebarLump />
        </label>
        <input
          className="w-full border-b-2 border-white pb-1 text-[15px] focus:outline-none focus:ring-0 focus:border-white"
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
          className="absolute top-15 bg-black/60 backdrop-blur-[5px] p-2 w-full text-[20px] rounded max-h-[calc(35vh-150px)] z-10 overflow-y-auto custom-scroll "
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
    </div>
  );
};

export default NavbarLayout;
