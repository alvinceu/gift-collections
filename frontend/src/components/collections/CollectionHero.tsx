import { motion } from 'framer-motion';
import TagList from '../common/TagList';
import type { Collection } from '@/types';

interface CollectionHeroProps {
  collection: Collection;
  onEdit?: () => void;
  isEditable?: boolean;
}

export default function CollectionHero({ collection, onEdit, isEditable }: CollectionHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative mb-8 rounded-lg overflow-hidden collection-gradient"
    >
      <div className="relative h-64 md:h-96">
        <img
          src={collection.coverImage || 'https://via.placeholder.com/1200x400?text=No+Image'}
          alt={collection.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-bold mb-2"
          >
            {collection.title}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg mb-4"
          >
            by {collection.authorName}
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TagList tags={collection.tags} className="text-white" />
          </motion.div>
          {isEditable && onEdit && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={onEdit}
              className="mt-4 btn-primary"
            >
              Edit Collection
            </motion.button>
          )}
        </div>
      </div>
      {collection.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-secondary text-lg px-6"
        >
          {collection.description}
        </motion.p>
      )}
    </motion.div>
  );
}
