const STORAGE_KEY_COLLECTIONS = 'gift-collections';
const STORAGE_KEY_USERS = 'gift-users';
const STORAGE_KEY_SESSION = 'gift-session';

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
    }
  },
};

export const getCollectionsFromStorage = (): any[] => {
  return storage.get<any[]>(STORAGE_KEY_COLLECTIONS) || [];
};

export const saveCollectionsToStorage = (collections: any[]): void => {
  storage.set(STORAGE_KEY_COLLECTIONS, collections);
};

export const getUsersFromStorage = (): any[] => {
  return storage.get<any[]>(STORAGE_KEY_USERS) || [];
};

export const saveUsersToStorage = (users: any[]): void => {
  storage.set(STORAGE_KEY_USERS, users);
};

export const getSessionFromStorage = (): any | null => {
  return storage.get<any>(STORAGE_KEY_SESSION);
};

export const saveSessionToStorage = (session: any): void => {
  storage.set(STORAGE_KEY_SESSION, session);
};

export const removeSessionFromStorage = (): void => {
  storage.remove(STORAGE_KEY_SESSION);
};
