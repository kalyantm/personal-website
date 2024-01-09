import React from "react";
import { Theme, useTheme } from "~/utils/theme-provider";
import Spacer from "../Spacer";
import ThemeIcon from "./ThemeIcon";

const ThemeToggler = ({ isMobile = false }) => {
  const [theme, setTheme] = useTheme();
  console.log("thme", theme);
  const switchTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };
  return isMobile ? (
    <button
      onClick={switchTheme}
      className="w-content flex items-baseline rounded-full border p-4"
    >
      <span>
        <ThemeIcon theme={theme} />
      </span>
      <Spacer width={24} />
      <span className="text-sm">
        Switch to {theme === "light" ? "dark" : "light"} mode
      </span>
    </button>
  ) : (
    <button onClick={switchTheme}>
      <ThemeIcon theme={theme} />
    </button>
  );
};

export default ThemeToggler;
