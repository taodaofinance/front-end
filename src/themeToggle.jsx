import React, {useEffect} from "react";
import { HiMoon, HiSun } from "react-icons/hi";
import { ThemeContext, DARK, LIGHT } from "./themeContext";

const Toggle = () => {
  const { theme, setTheme } = React.useContext(ThemeContext);

  useEffect(() => {
    const body = document.querySelector('body')

    if (theme === LIGHT) {
      body.classList.add("bg-gray-50");
      body.classList.remove("bg-black");
      return;
    }

    body.classList.add("bg-black");
    body.classList.remove("bg-gray-50");
  }, [theme])

  return (
    <a className="select-none inline-block transition duration-500 ease-in-out rounded-full p-2">
      {theme === DARK ? (
        <HiSun
          onClick={() => setTheme(theme === DARK ? LIGHT : "dark")}
          className="text-white hover:text-gold text-2xl cursor-pointer"
        />
      ) : (
        <HiMoon
          onClick={() => setTheme(theme === DARK ? LIGHT : "dark")}
          className="text-white hover:text-gold text-2xl cursor-pointer"
        />
      )}
    </a>
  );
};

export default Toggle;
