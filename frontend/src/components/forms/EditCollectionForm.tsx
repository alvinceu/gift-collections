import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { collectionsApi } from '@/services/api';
import { useIsDirty } from '@/hooks/useIsDirty';
import { useToastStore } from '@/store/toastStore';
import type { Collection } from '@/types';

const collectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  coverImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

interface EditCollectionFormProps {
  collection: Collection;
  onUpdate: (collection: Collection) => void;
}

export default function EditCollectionForm({ collection, onUpdate }: EditCollectionFormProps) {
  const [tags, setTags] = useState<string[]>(collection.tags);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: collection.title,
      description: collection.description,
      coverImage: collection.coverImage,
      tags: collection.tags,
    },
  });

  const formValues = watch();
  const originalData = {
    title: collection.title,
    description: collection.description,
    coverImage: collection.coverImage,
    tags: collection.tags,
  };
  const currentData = {
    ...formValues,
    tags,
  };
  const isDirty = useIsDirty(originalData, currentData);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const onSubmit = async (data: CollectionFormData) => {
    try {
      setIsSaving(true);
      const updated = await collectionsApi.updateCollection(collection.id, {
        ...data,
        tags,
        coverImage: data.coverImage || '',
      });
      showToast('Изменения сохранены', 'success');
      onUpdate(updated);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update collection';
      showToast(errorMessage, 'error');
      console.error('Failed to update collection:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto card mb-20"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#1A1A1D] dark:text-[#F4EFEA]">
          Edit Collection
        </h2>

        <div className="mb-4 p-3 bg-[#FFF7F2] dark:bg-[#232327] rounded-lg">
          <p className="text-sm text-secondary">
            Автор: <span className="font-medium">{collection.authorName}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-secondary">
              Title *
            </label>
            <input
              {...register('title')}
              className="input-field"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-secondary">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="input-field"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-secondary">
              Cover Image URL
            </label>
            <input
              {...register('coverImage')}
              type="url"
              className="input-field"
            />
            {errors.coverImage && (
              <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">{errors.coverImage.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-secondary">
              Tags
            </label>
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
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary"
              >
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
      </motion.form>

      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] dark:bg-[#1B1B1F] border-t border-[#EFE4DD] dark:border-[#1F1F23] p-4 z-50"
          >
            <div className="container mx-auto flex justify-center">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
                className="btn-primary px-8"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
