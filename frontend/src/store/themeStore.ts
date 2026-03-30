import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

interface ThemeStorePersist {
  theme: Theme;
}

export const useThemeStore = create<ThemeStore>()(
  persist<ThemeStore, ThemeStorePersist>(
    (set) => ({
      theme: 'light',
      toggleTheme: (): void => {
        set((state: ThemeStore): Partial<ThemeStore> => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },
      setTheme: (theme: Theme): void => {
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state): ThemeStorePersist => ({
        theme: state.theme,
      }),
    }
  )
);
