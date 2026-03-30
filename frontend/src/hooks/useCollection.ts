import { useState, useEffect } from 'react';
import { collectionsApi } from '@/services/api';
import type { Collection } from '@/types';

export function useCollection(id: string) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await collectionsApi.getCollectionById(id);
      if (!data) {
        setError('Collection not found');
      } else {
        setCollection(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch collection');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCollection();
    }
  }, [id]);

  return { collection, loading, error, refetch: fetchCollection };
}


