import type { Theme } from '@/store/themeStore';

export function applyTheme(theme: Theme): void {
  const root: HTMLElement = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
export function getStoredTheme(): Theme | null {
  try {
    const stored: string | null = localStorage.getItem('theme-storage');
    if (!stored) {
      return null;
    }
    
    const parsed: { state?: { theme?: Theme } } = JSON.parse(stored);
    return parsed.state?.theme ?? null;
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
    return null;
  }
}

export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function initializeTheme(defaultTheme: Theme = 'light'): Theme {
  const storedTheme: Theme | null = getStoredTheme();
  const systemPrefersDark: boolean = prefersDarkMode();
  
  const themeToApply: Theme = storedTheme ?? (systemPrefersDark ? 'dark' : defaultTheme);
  applyTheme(themeToApply);
  
  return themeToApply;
}
