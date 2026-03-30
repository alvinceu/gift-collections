import { useCurrentUser } from './useCurrentUser';
import type { Collection } from '@/types';

export function useIsAuthor(collection: Collection | null): boolean {
  const currentUser = useCurrentUser();
  
  if (!collection || !currentUser) {
    return false;
  }

  return collection.authorId === currentUser.id;
}


