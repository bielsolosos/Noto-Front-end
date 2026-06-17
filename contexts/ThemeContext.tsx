"use client";

import type React from "react";

import { useTheme as useNextTheme } from "next-themes";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useNextTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Evita mismatch entre SSR e cliente antes de montar.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const darkMode = isMounted && resolvedTheme === "dark";

  const toggleDarkMode = useCallback(() => {
    setTheme(darkMode ? "light" : "dark");
  }, [darkMode, setTheme]);

  const value = useMemo(
    () => ({ darkMode, toggleDarkMode }),
    [darkMode, toggleDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
