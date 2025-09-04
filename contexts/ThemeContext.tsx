"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Função para detectar preferência do sistema
  const getSystemPreference = () => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  };

  // Função para carregar preferência salva ou do sistema
  const loadThemePreference = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("noto-theme");
      if (saved) {
        return saved === "dark";
      }
      return getSystemPreference();
    }
    return false;
  };

  // Inicialização do tema
  useEffect(() => {
    const initialDarkMode = loadThemePreference();
    setDarkMode(initialDarkMode);
    setIsInitialized(true);

    // Listener para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Só muda automaticamente se não há preferência salva
      const saved = localStorage.getItem("noto-theme");
      if (!saved) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Aplicar tema ao DOM
  useEffect(() => {
    if (!isInitialized) return;

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Salvar preferência no localStorage
    localStorage.setItem("noto-theme", darkMode ? "dark" : "light");
  }, [darkMode, isInitialized]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
