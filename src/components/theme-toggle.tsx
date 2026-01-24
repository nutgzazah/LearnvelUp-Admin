"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-custom hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
    >
      <span className="text-xl">{theme === "dark" ? "🌙" : "☀️"}</span>
      <span className="font-bold text-text">
        {theme === "dark" ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
}
