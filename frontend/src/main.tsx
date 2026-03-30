import { StrictMode, useEffect, ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './app/router';
import { useThemeStore, type Theme } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { applyTheme, initializeTheme } from './utils/theme';

initializeTheme('light');

function App(): ReactElement {
  const theme: Theme = useThemeStore((state) => state.theme);
  const { checkAuth } = useAuthStore();

  useEffect((): void => {
    checkAuth();
  }, [checkAuth]);

  useEffect((): void => {
    applyTheme(theme);
  }, [theme]);

  return <RouterProvider router={router} />;
}

const rootElement: HTMLElement | null = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
