import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>('light');

  const applyThemeClass = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('app_theme') as 'light' | 'dark' | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      theme.value = savedTheme;
    } else {
      // Detección automática de preferencia del sistema operativo
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.value = prefersDark ? 'dark' : 'light';
    }
    applyThemeClass(theme.value === 'dark');
  };

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem('app_theme', theme.value);
    applyThemeClass(theme.value === 'dark');
    return theme.value;
  };

  return {
    theme,
    initTheme,
    toggleTheme,
  };
});
