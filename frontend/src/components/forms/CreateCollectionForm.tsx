import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collectionsApi } from '@/services/api';
import { useToastStore } from '@/store/toastStore';

const collectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  coverImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

export default function CreateCollectionForm() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      tags: [],
    },
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

  const onSubmit = async (data: CollectionFormData) => {
    try {
      const collection = await collectionsApi.createCollection({
        ...data,
        tags,
        coverImage: data.coverImage || '',
      });
      showToast('Коллекция создана!', 'success');
      navigate(`/collection/${collection.id}/edit`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create collection';
      showToast(errorMessage, 'error');
      console.error('Failed to create collection:', error);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto card"
    >
      <h2 className="text-2xl font-bold mb-6 text-[#1A1A1D] dark:text-[#F4EFEA]">
        Create New Collection
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-secondary">
            Title *
          </label>
          <input
            {...register('title')}
            className="input-field"
            placeholder="Enter collection title"
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
            placeholder="Enter collection description"
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
            placeholder="https://example.com/image.jpg"
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

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1"
        >
          {isSubmitting ? 'Creating...' : 'Create Collection'}
        </button>
      </div>
    </motion.form>
  );
}
