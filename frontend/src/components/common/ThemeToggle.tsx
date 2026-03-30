import { MouseEvent, ReactElement } from 'react';
import { motion, Variants } from 'framer-motion';
import { useThemeStore, type Theme } from '@/store/themeStore';

export default function ThemeToggle(): ReactElement {
  const { theme, toggleTheme } = useThemeStore();

  const handleToggle = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    toggleTheme();
  };

  const getIcon = (currentTheme: Theme): string => {
    return currentTheme === 'dark' ? '🌙' : '☀️';
  };

  const animationVariants: Variants = {
    light: {
      x: 0,
    },
    dark: {
      x: 28,
    },
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      className="relative w-14 h-7 rounded-full bg-[#FFF7F2] dark:bg-[#232327] transition-colors focus:outline-none focus:ring-2 focus:ring-[#CAA07D] focus:ring-offset-2 border border-[#E6DAD2] dark:border-[#2A2A2E]"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-pressed={theme === 'dark'}
    >
      <motion.div
        className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#CAA07D] shadow-md flex items-center justify-center"
        animate={theme}
        variants={animationVariants}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <span className="text-xs" role="img" aria-label={getIcon(theme)}>
          {getIcon(theme)}
        </span>
      </motion.div>
    </button>
  );
}
