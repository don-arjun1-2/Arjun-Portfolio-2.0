import { useState, useEffect } from 'react';
import { ThemeMode, getInitialTheme, toggleTheme, THEME_STORAGE_KEY } from '../utils/portfolioLogic';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return getInitialTheme(saved);
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // localStorage may fail in private mode
    }
  }, [theme]);

  const switchTheme = () => {
    setTheme((prev) => toggleTheme(prev));
  };

  return {
    theme,
    isDark: theme === 'dark',
    switchTheme,
    setTheme,
  };
}
