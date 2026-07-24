import React, { createContext, useContext, useEffect } from "react";

export type Theme = "midnight";

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "midnight" });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove("ivory");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "midnight" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
