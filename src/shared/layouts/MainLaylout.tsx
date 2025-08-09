import NavbarLayout from "./NavbarLayout";
import SidebarLayout from "./SidebarLayout";
import { Outlet } from "react-router"
import { useWeatherBackground } from "../lib";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import type { IDarkMoon } from "../types";

const MainLayout = () => {
  const [localDark, setLocalDark] = useState<boolean>(true);
  const seasonalBackground = useWeatherBackground();

  const darkMoon = useSelector((store: RootState) => store.weather.darkMode);


  useEffect(() => {
    const json = localStorage.getItem("darkMoon");
    if(json){
      const checkDark: IDarkMoon = JSON.parse(json);
      setLocalDark(checkDark.darkMoon);
    }
  }, [darkMoon]);

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `${ localDark ? "" : "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1))," } url(${seasonalBackground})`,
        transition: "all 1s ease-in-out",
      }}
    >
      <div className="flex-1 flex flex-col">
        <NavbarLayout />
        <main className="flex-1 pr-4 pl-4 pt-5 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <SidebarLayout />
    </div>
  );
};

export default MainLayout;
