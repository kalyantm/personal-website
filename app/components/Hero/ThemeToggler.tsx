import React from "react";
import { Sun, Moon } from "react-feather";

const ThemeToggler = () => {
  const [theme, setTheme] = React.useState("light");
  const nextTheme = theme === "light" ? "dark" : "light";
  console.log("theme", theme);

  React.useEffect(() => {
    const themePref = localStorage.getItem("theme");
    if (themePref) {
      setTheme(themePref);
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.getElementsByClassName("ReactModalPortal")[0].dataset.theme =
      theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const switchTheme = () => {
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <button onClick={switchTheme}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
};

export default ThemeToggler;
