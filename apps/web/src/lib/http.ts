const BASE = process.env.NEXT_PUBLIC_API_BASE!;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

type Opts = {
  auth?: boolean;
  headers?: HeadersInit;
  body?: unknown;
};

async function request<T>(method: string, path: string, opts: Opts = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  };

  if (opts.auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    cache: 'no-store',
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `HTTP ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const http = {
  get: <T>(p: string, o?: Omit<Opts, 'body'>) => request<T>('GET', p, o),
  post: <T>(p: string, body?: unknown, o?: Opts) => request<T>('POST', p, { ...o, body }),
  patch: <T>(p: string, body?: unknown, o?: Opts) => request<T>('PATCH', p, { ...o, body }),
  del: <T>(p: string, o?: Omit<Opts, 'body'>) => request<T>('DELETE', p, o),
};
