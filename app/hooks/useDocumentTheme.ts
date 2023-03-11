import { useState } from "react";

const useDocumentTheme = () => {
  const [theme, setTheme] = useState("light");
  if (typeof document !== "undefined") {
    const element = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          setTheme(document.documentElement.dataset.theme);
        }
      });
    });
    observer.observe(element, {
      attributes: true, //configure it to listen to attribute changes
    });
  }
  return theme;
};

export default useDocumentTheme;
