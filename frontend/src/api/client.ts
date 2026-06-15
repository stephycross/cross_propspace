// Centralized fetch wrapper. This is the single place the auth token is attached
// and where non-2xx responses are turned into thrown errors, so callers never
// repeat that boilerplate. It acts as the app's outbound HTTP interceptor.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";
const TOKEN_KEY = "propspace_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
  // When sending a FormData body the browser sets its own content type.
  isFormData?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    if (options.isFormData) {
      body = options.body as FormData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body,
    signal: options.signal,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Expired or rejected token: drop it so route guards send the user to login.
    if (response.status === 401) {
      clearToken();
    }
    const message = (payload as { message?: string }).message ?? "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body: unknown, opts: Partial<RequestOptions> = {}) =>
    request<T>(path, { method: "POST", body, ...opts }),
  put: <T>(path: string, body: unknown, opts: Partial<RequestOptions> = {}) =>
    request<T>(path, { method: "PUT", body, ...opts }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
