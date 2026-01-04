'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'theme-preference';

const getResolvedTheme = (theme: string) => {
  if (theme !== 'auto') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: string) => {
  const resolved = getResolvedTheme(theme);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
};

export default function ThemeClient() {
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) ?? 'dark';
    applyTheme(stored);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const current = window.localStorage.getItem(STORAGE_KEY) ?? 'dark';
      if (current === 'auto') applyTheme('auto');
    };

    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return null;
}
