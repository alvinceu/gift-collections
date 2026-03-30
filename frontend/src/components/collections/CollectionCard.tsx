import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TagList from '../common/TagList';
import type { Collection } from '@/types';

interface CollectionCardProps {
  collection: Collection;
  index: number;
}

export default function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="card-hover cursor-pointer overflow-hidden"
    >
      <Link to={`/collection/${collection.id}`}>
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
          <img
            src={collection.coverImage || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={collection.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[#1A1A1D] dark:text-[#F4EFEA] line-clamp-2">
          {collection.title}
        </h3>
        <p className="text-sm text-secondary mb-2">
          by {collection.authorName}
        </p>
        <p className="text-sm text-muted mb-3 line-clamp-2">
          {collection.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium price-text">
            {collection.items.length} {collection.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <TagList tags={collection.tags} />
      </Link>
    </motion.div>
  );
}
