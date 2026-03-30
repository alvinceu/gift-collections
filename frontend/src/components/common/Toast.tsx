import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, 3000);
      return () => clearTimeout(timer);
    });
  }, [toasts, onRemove]);

  const getToastStyles = (type: ToastType): string => {
    switch (type) {
      case 'success':
        return 'bg-[#5F8F72] dark:bg-[#6FAF8A] text-white';
      case 'error':
        return 'bg-[#C46A5A] dark:bg-[#D07A6A] text-white';
      case 'warning':
        return 'bg-[#D2A24C] dark:bg-[#E0B85C] text-white';
      case 'info':
        return 'bg-[#CAA07D] text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const content = (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`${getToastStyles(toast.type)} px-4 py-3 rounded-lg shadow-lg min-w-[300px] flex items-center justify-between`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}


