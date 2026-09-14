import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference from localStorage or html class
    const savedTheme = localStorage.getItem("skillsmap_theme");
    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextState = !isDark;
    setIsDark(nextState);

    if (nextState) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("skillsmap_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("skillsmap_theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        "relative p-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
        isDark
          ? "bg-slate-800/90 border-slate-700 text-amber-300 hover:bg-slate-700 hover:text-amber-200"
          : "bg-white border-slate-200/90 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-2xs",
        className
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>
    </button>
  );
}
