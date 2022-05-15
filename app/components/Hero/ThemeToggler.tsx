import React from "react";
import Spacer from "../Spacer";
import ThemeIcon from "./ThemeIcon";

const ThemeToggler = ({ isMobile = false }) => {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const nextTheme = theme === "light" ? "dark" : "light";

  React.useEffect(() => {
    const themePref = localStorage.getItem("theme");
    if (themePref) {
      setTheme(themePref as "light" | "dark");
    }
  }, []);

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    document.documentElement.dataset.theme = theme;
    document.getElementsByClassName("ReactModalPortal")[0].dataset.theme =
      theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const switchTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
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
