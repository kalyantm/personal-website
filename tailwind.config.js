module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        md: "820px",
        lgV2: "1106px",
      },
      boxShadow: {
        footer: "var(--shadow-footer)",
        lg: "var(--shadow-lg)",
      },
    },
    colors: {
      "main-bg": "var(--color-bg)",
      secondary: "var(--color-secondary)",
      accent: "var(--color-accent)",
      primary: "var(--color-text)",
      "grey-500": "var(--color-hill-stop-5)",
    },
  },
  plugins: [],
};
