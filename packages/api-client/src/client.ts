import type { ApiResponse } from "@mahalle/types";

export interface ApiClientOptions {
  /** e.g. http://api.mahalle.test:4000/api/v1 */
  baseUrl: string;
  /** Called before every request so callers (web, future Flutter) can attach auth. */
  getHeaders?: () => Record<string, string> | Promise<Record<string, string>>;
  /**
   * Returns the current app scope ("admin" | "control" | "tenant") so the
   * API can find the right app-scoped session cookie, and so this client
   * reads the matching app-scoped CSRF cookie. Since one browser bundle
   * serves every subdomain, callers should compute this per-request (e.g.
   * from window.location) rather than fixing it at construction time.
   */
  getAppScope?: () => string | undefined;
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Reads the (deliberately non-HttpOnly) app-scoped csrf cookie set by the API after login. Browser-only. */
function readCsrfCookie(cookieName: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${cookieName}=([^;]+)`));
  return match?.[1];
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS", undefined]);

/** Thin, typed wrapper over fetch. Business logic and auth checks live in the API, not here. */
export class ApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const appScope = this.options.getAppScope?.();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(appScope ? { "x-app": appScope } : {}),
      ...(await this.options.getHeaders?.())
    };

    if (!SAFE_METHODS.has(init?.method)) {
      const csrfToken = appScope ? readCsrfCookie(`${appScope}_csrf_token`) : undefined;
      if (csrfToken) headers["x-csrf-token"] = csrfToken;
    }

    const res = await fetch(`${this.options.baseUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: { ...headers, ...init?.headers }
    });

    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return undefined as T;
    }

    const text = await res.text();
    if (!text || !text.trim()) {
      return undefined as T;
    }

    let body: ApiResponse<T>;
    try {
      body = JSON.parse(text) as ApiResponse<T>;
    } catch {
      if (res.ok) {
        return undefined as T;
      }
      throw new ApiError("HTTP_ERROR", `HTTP ${res.status} ${res.statusText}`, res.status);
    }

    if (!body.success) {
      throw new ApiError(body.error.code, body.error.message, res.status, body.error.details);
    }

    return body.data;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>(path, { method: "POST", body: JSON.stringify(data) });
  }

  patch<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>(path, { method: "PATCH", body: JSON.stringify(data) });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }

  /** For multipart file uploads — omits the JSON Content-Type header so the browser can set its own multipart boundary. */
  private async requestForm<T>(path: string, formData: FormData): Promise<T> {
    const appScope = this.options.getAppScope?.();
    const headers: Record<string, string> = {
      ...(appScope ? { "x-app": appScope } : {}),
      ...(await this.options.getHeaders?.())
    };
    const csrfToken = appScope ? readCsrfCookie(`${appScope}_csrf_token`) : undefined;
    if (csrfToken) headers["x-csrf-token"] = csrfToken;

    const res = await fetch(`${this.options.baseUrl}${path}`, {
      method: "POST",
      credentials: "include",
      headers,
      body: formData
    });

    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return undefined as T;
    }

    const text = await res.text();
    if (!text || !text.trim()) {
      return undefined as T;
    }

    let body: ApiResponse<T>;
    try {
      body = JSON.parse(text) as ApiResponse<T>;
    } catch {
      if (res.ok) {
        return undefined as T;
      }
      throw new ApiError("HTTP_ERROR", `HTTP ${res.status} ${res.statusText}`, res.status);
    }

    if (!body.success) {
      throw new ApiError(body.error.code, body.error.message, res.status, body.error.details);
    }
    return body.data;
  }

  postForm<T>(path: string, formData: FormData): Promise<T> {
    return this.requestForm<T>(path, formData);
  }
}
