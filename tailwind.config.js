module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  darkMode: "class",
  theme: {
    fontWeight: {
      normal: 300,
      medium: 400,
      bold: 600,
    },
    extend: {
      screens: {
        md: "820px",
        lgV2: "1106px",
      },
      boxShadow: {
        footer: "var(--shadow-footer)",
        lg: "var(--shadow-lg)",
        card: "var(--shadow-card)",
      },
    },
    colors: {
      "main-bg": "var(--color-bg)",
      secondary: "var(--color-secondary)",
      accent: "var(--color-accent)",
      primary: "var(--color-text)",
      "grey-500": "var(--color-hill-stop-5)",
      "spotify-green": "#1DB954",
      "book-red": "#FF4545",
      "location-blue": "#4A89F3",
      "sc-yellow": "#FFFC00",
    },
  },
  plugins: [],
};
