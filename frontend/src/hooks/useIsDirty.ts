import { useEffect, useState } from 'react';

export function useIsDirty<T>(original: T, current: T): boolean {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setIsDirty(JSON.stringify(original) !== JSON.stringify(current));
  }, [original, current]);

  return isDirty;
}


