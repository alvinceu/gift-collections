import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCollection } from '@/hooks/useCollection';
import { useIsAuthor } from '@/hooks/useIsAuthor';
import CollectionHero from '@/components/collections/CollectionHero';
import GiftItemCard from '@/components/gifts/GiftItemCard';
import GiftItemModal from '@/components/gifts/GiftItemModal';
import { Loader, Error } from '@/components/common/States';
import { useModal } from '@/hooks/useModal';
import type { GiftItem } from '@/types';

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collection, loading, error, refetch } = useCollection(id || '');
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null);
  const isAuthor = useIsAuthor(collection);

  const handleItemClick = (item: GiftItem) => {
    setSelectedItem(item);
    openModal();
  };

  const handleEdit = () => {
    if (isAuthor) {
      navigate(`/collection/${id}/edit`);
    }
  };

  if (loading) {
    return <Loader message="Loading collection..." />;
  }

  if (error || !collection) {
    return <Error message={error || 'Collection not found'} onRetry={refetch} />;
  }

  return (
    <div>
      <CollectionHero collection={collection} onEdit={handleEdit} isEditable={isAuthor} />
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1A1A1D] dark:text-[#F4EFEA]">
          Gift Items ({collection.items.length})
        </h2>
      </div>

      {collection.items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-secondary mb-4">
            No items in this collection yet.
          </p>
          {isAuthor && (
            <Link to={`/collection/${id}/edit`} className="btn-primary">
              Add Items
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collection.items.map((item, index) => (
            <GiftItemCard
              key={item.id}
              item={item}
              onClick={() => handleItemClick(item)}
              index={index}
            />
          ))}
        </div>
      )}

      <GiftItemModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={closeModal}
        isEditable={isAuthor}
      />
    </div>
  );
}
