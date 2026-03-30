import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import TagList from '../common/TagList';
import type { GiftItem } from '@/types';

interface GiftItemModalProps {
  isOpen: boolean;
  item: GiftItem | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditable?: boolean;
}

const formatPrice = (price: number, currency: string): string => {
  const symbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  };
  return `${price.toLocaleString()} ${symbols[currency] || currency}`;
};

export default function GiftItemModal({
  isOpen,
  item,
  onClose,
  onEdit,
  onDelete,
  isEditable,
}: GiftItemModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!item) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 md:h-96">
                <img
                  src={item.image || 'https://via.placeholder.com/800x600?text=No+Image'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-[#1A1A1D] dark:text-[#F4EFEA]">
                  {item.title}
                </h2>
                <p className="text-3xl font-bold price-text mb-4">
                  {formatPrice(item.price, item.currency)}
                </p>
                {item.description && (
                  <p className="text-secondary mb-4">
                    {item.description}
                  </p>
                )}
                <TagList tags={item.tags} className="mb-6" />
                <div className="flex gap-3 flex-wrap">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Go to Store
                    </a>
                  )}
                  {isEditable && onEdit && (
                    <button onClick={onEdit} className="btn-secondary">
                      Edit
                    </button>
                  )}
                  {isEditable && onDelete && (
                    <button onClick={onDelete} className="btn-danger">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}
