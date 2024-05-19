import { useTheme } from "~/utils/theme-provider";

export default function VercelIcon() {
  const [theme] = useTheme();
  return (
    <svg
      style={{ marginTop: "16px" }}
      height="32"
      width="32"
      fill={theme === "dark" ? "#fff" : "#000"}
    >
      <path d="M8 1L16 15H0L8"></path>
    </svg>
  );
}
