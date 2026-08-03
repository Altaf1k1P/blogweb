import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full transition-all duration-300 glass-effect text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <i className="fas fa-sun text-yellow-400 text-lg"></i>
      ) : (
        <i className="fas fa-moon text-indigo-500 text-lg"></i>
      )}
    </button>
  );
}
