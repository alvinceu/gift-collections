import { motion } from 'framer-motion';
import TagList from '../common/TagList';
import type { GiftItem } from '@/types';

interface GiftItemCardProps {
  item: GiftItem;
  onClick: () => void;
  index: number;
}

const formatPrice = (price: number, currency: string): string => {
  const symbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  };
  return `${price.toLocaleString()} ${symbols[currency] || currency}`;
};

export default function GiftItemCard({ item, onClick, index }: GiftItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className="card-hover cursor-pointer overflow-hidden"
    >
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <img
          src={item.image || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-[#1A1A1D] dark:text-[#F4EFEA] line-clamp-2">
        {item.title}
      </h3>
      <p className="text-xl font-bold price-text mb-3">
        {formatPrice(item.price, item.currency)}
      </p>
      <TagList tags={item.tags} />
    </motion.div>
  );
}
