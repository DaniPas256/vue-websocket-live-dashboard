import { defineStore } from 'pinia';

type Theme = 'light' | 'dark';

const THEME_KEY = 'live-dashboard-theme';

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: readInitialTheme() as Theme,
  }),
  actions: {
    setTheme(theme: Theme) {
      this.theme = theme;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_KEY, theme);
        document.documentElement.dataset.theme = theme;
      }
    },
    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light');
    },
  },
});

