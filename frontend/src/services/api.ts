import type { Collection, GiftItem, CreateCollectionData, UpdateCollectionData, CreateGiftItemData, UpdateGiftItemData } from '@/types';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('auth-token');
  } catch {
    return null;
  }
}

async function apiFetch<T>(
  path: string,
  init: (RequestInit & { authRequired?: boolean }) = {},
): Promise<T> {
  const { authRequired, headers, ...rest } = init;

  const mergedHeaders = new Headers(headers);
  mergedHeaders.set('Content-Type', 'application/json');

  if (authRequired) {
    const token = getAuthToken();
    if (!token) {
      throw new ApiError('Unauthorized', 401, null);
    }
    mergedHeaders.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: mergedHeaders,
    body:
      rest.body === undefined
        ? undefined
        : typeof rest.body === 'string'
          ? rest.body
          : JSON.stringify(rest.body),
  });

  if (!res.ok) {
    let payload: unknown = null;
    try {
      // NestJS обычно возвращает JSON с `message`
      payload = await res.json();
    } catch {
      payload = null;
    }

    const message =
      (payload && typeof payload === 'object' && 'message' in payload && typeof (payload as any).message === 'string')
        ? (payload as any).message
        : `Request failed with ${res.status}`;

    throw new ApiError(message, res.status, payload);
  }

  // DELETE может возвращать пустое тело (204/empty JSON).
  const contentType = res.headers.get('content-type') || '';
  if (res.status === 204 || !contentType.includes('application/json')) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const collectionsApi = {
  async getCollections(options?: { search?: string; tags?: string[] }): Promise<Collection[]> {
    const search = options?.search?.trim();
    const tagsParam = options?.tags && options.tags.length > 0 ? options.tags.join(',') : undefined;

    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (tagsParam) query.set('tags', tagsParam);

    const qs = query.toString();
    const path = qs ? `/collections?${qs}` : '/collections';
    return apiFetch<Collection[]>(path, { method: 'GET' });
  },

  async getCollectionById(id: string): Promise<Collection | null> {
    return apiFetch<Collection>(`/collections/${id}`, { method: 'GET' }).catch(() => null);
  },

  async createCollection(data: CreateCollectionData): Promise<Collection> {
    return apiFetch<Collection>(`/collections`, { method: 'POST', authRequired: true, body: data });
  },

  async updateCollection(id: string, data: UpdateCollectionData): Promise<Collection> {
    return apiFetch<Collection>(`/collections/${id}`, { method: 'PUT', authRequired: true, body: data });
  },

  async deleteCollection(id: string): Promise<void> {
    await apiFetch<void>(`/collections/${id}`, { method: 'DELETE', authRequired: true });
  },

  async addItem(collectionId: string, item: CreateGiftItemData): Promise<GiftItem> {
    return apiFetch<GiftItem>(
      `/collections/${collectionId}/items`,
      { method: 'POST', authRequired: true, body: item },
    );
  },

  async updateItem(collectionId: string, itemId: string, data: UpdateGiftItemData): Promise<GiftItem> {
    return apiFetch<GiftItem>(
      `/collections/${collectionId}/items/${itemId}`,
      { method: 'PUT', authRequired: true, body: data },
    );
  },

  async deleteItem(collectionId: string, itemId: string): Promise<void> {
    await apiFetch<void>(`/collections/${collectionId}/items/${itemId}`, { method: 'DELETE', authRequired: true });
  },
};
