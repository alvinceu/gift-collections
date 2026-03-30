import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCollections } from '@/hooks/useCollections';
import CollectionGrid from '@/components/collections/CollectionGrid';
import SearchBar from '@/components/common/SearchBar';
import { Loader, Error, Empty } from '@/components/common/States';

type SortOption = 'date' | 'items' | 'title';

export default function HomePage() {
  const navigate = useNavigate();
  const { collections, loading, error, refetch } = useCollections();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredAndSortedCollections = useMemo(() => {
    let filtered = [...collections];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (collection) =>
          (collection.title?.toLowerCase() || '').includes(query) ||
          (collection.authorName?.toLowerCase() || '').includes(query) ||
          (collection.tags || []).some((tag) => (tag?.toLowerCase() || '').includes(query))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((collection) =>
        (collection.tags || []).includes(selectedTag)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'items':
          return (b.items?.length || 0) - (a.items?.length || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [collections, searchQuery, sortBy, selectedTag]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    collections.forEach((collection) => {
      (collection.tags || []).forEach((tag) => {
        if (tag) {
          tagSet.add(tag);
        }
      });
    });
    return Array.from(tagSet);
  }, [collections]);

  if (loading) {
    return <Loader message="Loading collections..." />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-4 text-[#1A1A1D] dark:text-[#F4EFEA]">
          Gift Collections
        </h1>
        <p className="text-secondary mb-6">
          Discover and create amazing gift collections
        </p>
      </motion.div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title, author, or tags..."
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="input-field md:w-48"
          >
            <option value="date">Sort by Date</option>
            <option value="items">Sort by Items</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-[#FFF7F2] dark:bg-[#232327] text-secondary'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? 'bg-primary-600 text-white'
                    : 'bg-[#FFF7F2] dark:bg-[#232327] text-secondary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredAndSortedCollections.length === 0 ? (
        <Empty
          message={
            searchQuery || selectedTag
              ? 'No collections match your filters'
              : 'No collections yet'
          }
          actionLabel={collections.length === 0 ? 'Create First Collection' : undefined}
          onAction={
            collections.length === 0
              ? () => {
                  navigate('/create');
                }
              : undefined
          }
        />
      ) : (
        <>
          <p className="text-sm text-secondary mb-4">
            Found {filteredAndSortedCollections.length} collection
            {filteredAndSortedCollections.length !== 1 ? 's' : ''}
          </p>
          <CollectionGrid collections={filteredAndSortedCollections} />
        </>
      )}
    </div>
  );
}
