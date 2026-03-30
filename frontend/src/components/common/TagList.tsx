import { motion } from 'framer-motion';

interface TagListProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  className?: string;
}

export default function TagList({ tags, onTagClick, className = '' }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <motion.span
          key={tag}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onTagClick?.(tag)}
          className={`px-2 py-1 text-xs rounded-full bg-[#EAD5C3] dark:bg-[#CAA07D33] text-[#1A1A1D] dark:text-[#F4EFEA] ${
            onTagClick ? 'cursor-pointer hover:bg-[#B88B67] dark:hover:bg-[#E0B48F]' : ''
          }`}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}
