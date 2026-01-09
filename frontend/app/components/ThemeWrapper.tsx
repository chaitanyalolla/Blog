"use client";

import { useTheme } from "@/lib/context/theme";

export default function ThemeWrapper({ children }) {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      {children}
    </div>
  );
}
