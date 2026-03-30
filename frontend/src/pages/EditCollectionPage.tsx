import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '@/hooks/useCollection';
import EditCollectionForm from '@/components/forms/EditCollectionForm';
import EditGiftItemForm from '@/components/forms/EditGiftItemForm';
import GiftItemCard from '@/components/gifts/GiftItemCard';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Loader, Error } from '@/components/common/States';
import { useModal } from '@/hooks/useModal';
import { useConfirm } from '@/hooks/useConfirm';
import { collectionsApi } from '@/services/api';
import { useToastStore } from '@/store/toastStore';
import type { GiftItem, CreateGiftItemData, UpdateGiftItemData } from '@/types';

const giftItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  image: z.string().url('Invalid URL').optional().or(z.literal('')),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.enum(['RUB', 'USD', 'EUR']),
  description: z.string().max(500, 'Description is too long').optional(),
  tags: z.array(z.string()).default([]),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export default function EditCollectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collection, loading, error, refetch } = useCollection(id || '');
  const { isOpen: isAddFormOpen, open: openAddForm, close: closeAddForm } = useModal();
  const { isOpen: isEditFormOpen, open: openEditForm, close: closeEditForm } = useModal();
  const confirm = useConfirm();
  const showToast = useToastStore((state) => state.showToast);
  const [editingItem, setEditingItem] = useState<GiftItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCollectionUpdate = async () => {
    await refetch();
  };

  const handleAddItem = async (data: CreateGiftItemData) => {
    if (!collection) return;
    try {
      setIsSubmitting(true);
      await collectionsApi.addItem(collection.id, data);
      showToast('Товар добавлен', 'success');
      await refetch();
      closeAddForm();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
      showToast(errorMessage, 'error');
      console.error('Failed to add item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = (item: GiftItem) => {
    setEditingItem(item);
    openEditForm();
  };

  const handleUpdateItem = async (data: UpdateGiftItemData) => {
    if (!collection || !editingItem) return;
    try {
      setIsSubmitting(true);
      await collectionsApi.updateItem(collection.id, editingItem.id, data);
      showToast('Товар обновлен', 'success');
      await refetch();
      closeEditForm();
      setEditingItem(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      showToast(errorMessage, 'error');
      console.error('Failed to update item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = (item: GiftItem) => {
    if (!collection) return;
    confirm.confirm(
      `Are you sure you want to delete "${item.title}"?`,
      async () => {
        try {
          await collectionsApi.deleteItem(collection.id, item.id);
          showToast('Товар удален', 'success');
          await refetch();
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
          showToast(errorMessage, 'error');
          console.error('Failed to delete item:', err);
        }
      }
    );
  };

  const handleDeleteCollection = () => {
    if (!collection) return;
    confirm.confirm(
      `Are you sure you want to delete the collection "${collection.title}"? This action cannot be undone.`,
      async () => {
        try {
          await collectionsApi.deleteCollection(collection.id);
          showToast('Коллекция удалена', 'success');
          navigate('/');
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete collection';
          showToast(errorMessage, 'error');
          console.error('Failed to delete collection:', err);
        }
      }
    );
  };

  if (loading) {
    return <Loader message="Loading collection..." />;
  }

  if (error || !collection) {
    return <Error message={error || 'Collection not found'} onRetry={refetch} />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1A1A1D] dark:text-[#F4EFEA]">
          Edit Collection
        </h1>
        <button onClick={handleDeleteCollection} className="btn-danger">
          Delete Collection
        </button>
      </div>

      <EditCollectionForm collection={collection} onUpdate={handleCollectionUpdate} />

      <div className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1A1A1D] dark:text-[#F4EFEA]">
            Gift Items ({collection.items.length})
          </h2>
          <button onClick={openAddForm} className="btn-primary">
            Add Item
          </button>
        </div>

        {collection.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-secondary mb-4">
              No items yet. Add your first item!
            </p>
            <button onClick={openAddForm} className="btn-primary">
              Add First Item
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <GiftItemCard
                  item={item}
                  onClick={() => handleEditItem(item)}
                  index={index}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item);
                    }}
                    className="w-8 h-8 bg-[#C46A5A] dark:bg-[#D07A6A] text-white rounded-full flex items-center justify-center hover:opacity-90"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeAddForm}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <AddItemForm
                onSubmit={handleAddItem}
                onCancel={closeAddForm}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </motion.div>
        )}

        {isEditFormOpen && editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeEditForm}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <EditGiftItemForm
                item={editingItem}
                onSubmit={handleUpdateItem}
                onCancel={() => {
                  closeEditForm();
                  setEditingItem(null);
                }}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.handleConfirm}
        onCancel={confirm.close}
      />
    </div>
  );
}

function AddItemForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  onSubmit: (data: CreateGiftItemData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(giftItemSchema),
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="card shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-[#1A1A1D] dark:text-[#F4EFEA]">
        Add New Item
      </h2>
      <form onSubmit={handleSubmit((data: any) => onSubmit({ ...data, tags }))}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-secondary">Title *</label>
            <input {...register('title', { required: true })} className="input-field" />
            {errors.title && (
              <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-secondary">Image URL</label>
            <input {...register('image')} type="url" className="input-field" />
            {errors.image && (
              <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">{errors.image.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-secondary">Price *</label>
              <input
                {...register('price', { required: true, valueAsNumber: true })}
                type="number"
                step="0.01"
                className="input-field"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-secondary">Currency *</label>
              <select {...register('currency', { required: true })} className="input-field">
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              {errors.currency && (
                <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">{errors.currency.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-secondary">Description</label>
            <textarea {...register('description')} rows={4} className="input-field" />
            {errors.description && (
              <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">{errors.description.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-secondary">Link</label>
            <input {...register('link')} type="url" className="input-field" />
            {errors.link && (
              <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">{errors.link.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-secondary">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="input-field flex-1"
                placeholder="Add a tag and press Enter"
              />
              <button type="button" onClick={addTag} className="btn-secondary">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#EAD5C3] dark:bg-[#CAA07D33] text-[#1A1A1D] dark:text-[#F4EFEA] rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
