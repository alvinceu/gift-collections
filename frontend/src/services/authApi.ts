import type { User, LoginData, RegisterData } from '@/types';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

  const contentType = res.headers.get('content-type') || '';
  if (res.status === 204 || !contentType.includes('application/json')) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const authApi = {
  async register(data: RegisterData): Promise<User> {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const payload = { name: data.name, email: data.email, password: data.password };

    const result = await apiFetch<{ accessToken: string; user: User }>(
      '/auth/register',
      { method: 'POST', body: payload },
    );

    localStorage.setItem('auth-token', result.accessToken);
    return result.user;
  },

  async login(data: LoginData): Promise<User> {
    const payload = { email: data.email, password: data.password };

    const result = await apiFetch<{ accessToken: string; user: User }>(
      '/auth/login',
      { method: 'POST', body: payload },
    );

    localStorage.setItem('auth-token', result.accessToken);
    return result.user;
  },

  async logout(): Promise<void> {
    try {
      localStorage.removeItem('auth-token');
    } catch {
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getAuthToken();
    if (!token) return null;

    try {
      return await apiFetch<User>('/auth/profile', { method: 'GET', authRequired: true });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        return null;
      }
      throw err;
    }
  },
};


