import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, ReactElement } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import logo from '@/assets/logo.png';

export default function Header(): ReactElement {
  const { isAuthenticated, logout } = useAuth();
  const currentUser = useCurrentUser();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async (): Promise<void> => {
    await logout();
    setShowMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF]/70 dark:bg-[#141417]/70 backdrop-blur-xl shadow-md border-b border-[#E6DAD2]/50 dark:border-[#2A2A2E]/50"
    >
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <nav className="flex items-center justify-between">
          <Link
            to="/about" 
            className="flex items-center gap-1.5 sm:gap-3 text-base sm:text-xl lg:text-2xl font-bold text-[#CAA07D] hover:opacity-80 transition-opacity min-w-0 flex-shrink"
          >
            <img src={logo} alt="Gift Collections Logo" className="h-6 w-6 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain flex-shrink-0" />
            <span className="hidden sm:inline truncate">Gift Collections</span>
            <span className="sm:hidden truncate text-sm">Gift</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Link
              to="/"
              className="px-2 lg:px-4 py-2 text-sm lg:text-base text-secondary hover:text-[#CAA07D] transition-colors"
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="btn-primary text-sm lg:text-base px-2 lg:px-4 py-1.5 lg:py-2"
                >
                  Create
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="px-2 lg:px-4 py-2 text-sm lg:text-base text-secondary hover:text-[#CAA07D] transition-colors flex items-center gap-1 lg:gap-2"
                  >
                    <span className="max-w-[80px] lg:max-w-[100px] truncate">{currentUser?.name || 'User'}</span>
                    <span className="text-xs">▼</span>
                  </button>
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 card shadow-lg z-50"
                      >
                        <div className="py-2">
                          <div className="px-4 py-2 text-sm text-secondary border-b border-[#E6DAD2] dark:border-[#2A2A2E]">
                            {currentUser?.email}
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-[#FFF7F2] dark:hover:bg-[#232327] transition-colors"
                          >
                            Выйти
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-2 lg:px-4 py-2 text-sm lg:text-base text-secondary hover:text-[#CAA07D] transition-colors"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm lg:text-base px-2 lg:px-4 py-1.5 lg:py-2"
                >
                  Регистрация
                </Link>
              </>
            )}
            
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-secondary hover:text-[#CAA07D] transition-colors"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 pb-2 border-t border-[#E6DAD2]/50 dark:border-[#2A2A2E]/50 overflow-hidden"
            >
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-4 py-2 text-sm text-secondary hover:text-[#CAA07D] transition-colors"
                >
                  Home
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/create"
                      onClick={() => setShowMobileMenu(false)}
                      className="btn-primary text-center text-sm py-2"
                    >
                      Create Collection
                    </Link>
                    <div className="px-4 py-2 text-sm text-secondary border-t border-[#E6DAD2] dark:border-[#2A2A2E] pt-2 mt-1">
                      <div className="font-medium mb-1 truncate">{currentUser?.name || 'User'}</div>
                      <div className="text-xs text-muted truncate">{currentUser?.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-left text-sm text-secondary hover:text-[#CAA07D] transition-colors"
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setShowMobileMenu(false)}
                      className="px-4 py-2 text-sm text-secondary hover:text-[#CAA07D] transition-colors"
                    >
                      Войти
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setShowMobileMenu(false)}
                      className="btn-primary text-center text-sm py-2"
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
