import { useEffect, useState } from "react";

interface HeaderProps {
  category: string;
  dayIndex: number;
}

const STORAGE_KEY = "omscs-wordle-theme";

function getInitialTheme(): string {
  return localStorage.getItem(STORAGE_KEY) ?? "wordle";
}

function applyTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function Header({ category, dayIndex }: HeaderProps) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "wordle" ? "omscs" : "wordle";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <header className="header">
      <div className="header-top">
        <h1>OMSCS Wordle</h1>
        <div className="theme-toggle-wrap">
          <span className="theme-toggle-wrap__label">Theme</span>
          <button
            className={`theme-toggle ${theme === "omscs" ? "theme-toggle--active" : ""}`}
            onClick={toggleTheme}
            title={`Switch to ${theme === "wordle" ? "OMSCS" : "Wordle"} theme`}
          >
            <span className="theme-toggle__label">Wordle</span>
            <span className="theme-toggle__slider" />
            <span className="theme-toggle__label">OMSCS</span>
          </button>
        </div>
      </div>
      <div className="day-number">#{dayIndex}</div>
      <div className="category">{category}</div>
    </header>
  );
}