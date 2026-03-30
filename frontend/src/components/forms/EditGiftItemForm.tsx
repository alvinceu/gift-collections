import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { GiftItem, Currency } from '@/types';

const giftItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  image: z.string().url('Invalid URL').optional().or(z.literal('')),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.enum(['RUB', 'USD', 'EUR']),
  description: z.string().max(500, 'Description is too long').optional(),
  tags: z.array(z.string()).default([]),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type GiftItemFormData = z.infer<typeof giftItemSchema>;

interface EditGiftItemFormProps {
  item: GiftItem;
  onSubmit: (data: GiftItemFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function EditGiftItemForm({
  item,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EditGiftItemFormProps) {
  const [tags, setTags] = useState<string[]>(item.tags);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GiftItemFormData>({
    resolver: zodResolver(giftItemSchema),
    defaultValues: {
      title: item.title,
      image: item.image,
      price: item.price,
      currency: item.currency,
      description: item.description,
      tags: item.tags,
      link: item.link,
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleFormSubmit = async (data: GiftItemFormData) => {
    await onSubmit({ ...data, tags });
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="card max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-[#1A1A1D] dark:text-[#F4EFEA]">
        Edit Gift Item
      </h2>

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
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Image URL
          </label>
          <input
            {...register('image')}
            type="url"
            className="input-field"
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Price *
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="input-field"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Currency *
            </label>
            <select
              {...register('currency')}
              className="input-field"
            >
              <option value="RUB">RUB</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            {errors.currency && (
              <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="input-field"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Link
          </label>
          <input
            {...register('link')}
            type="url"
            className="input-field"
            placeholder="https://example.com/product"
          />
          {errors.link && (
            <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-primary-900 dark:hover:text-primary-100"
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
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </motion.form>
  );
}

