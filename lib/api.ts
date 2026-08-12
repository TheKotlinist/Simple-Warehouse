const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function request(path: string, options: FetchOptions = {}) {
  const { body, ...restOptions } = options;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers || {}) as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
  };

  if (body) {
    if (typeof body === 'object' && body !== null) {
      config.body = JSON.stringify(body);
    } else {
      config.body = body as BodyInit;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server');
  }

  return data;
}

export const api = {
  get: (path: string, options?: FetchOptions) => request(path, { ...options, method: 'GET' }),
  post: (path: string, body: unknown, options?: FetchOptions) => request(path, { ...options, method: 'POST', body }),
  put: (path: string, body: unknown, options?: FetchOptions) => request(path, { ...options, method: 'PUT', body }),
  delete: (path: string, options?: FetchOptions) => request(path, { ...options, method: 'DELETE' }),
};
