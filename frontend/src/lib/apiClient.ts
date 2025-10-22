import config from "@/config";
import type { ApiError } from "@/types";

const API_BASE_URL = config.api.baseUrl;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiRequestError";
  }

  public static fromResponse(response: Response, body?: unknown): ApiRequestError {
    const data = (typeof body === "object" && body !== null)
      ? (body as Partial<ApiError>)
      : undefined;

    const message = data?.message || (data as { error?: string })?.error || `Request failed with status ${response.status}`;
    const code = data?.code;
    const errors = data?.errors;

    return new ApiRequestError(message ?? "Request failed", response.status, code, errors);
  }

  public getUserMessage(): string {
    if (this.statusCode === 401) {
      return 'Invalid credentials. Please check your email and password.';
    }
    if (this.statusCode === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (this.statusCode === 404) {
      return 'The requested resource was not found.';
    }
    if (this.statusCode === 429) {
      return 'Too many requests. Please try again later.';
    }
    if (this.statusCode && this.statusCode >= 500) {
      return 'Server error. Please try again later.';
    }
    return this.message || 'An unexpected error occurred.';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, skipAuth, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add authorization header if token is provided or available in localStorage
  if (!skipAuth) {
    const authToken = token || localStorage.getItem('token');
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Try to parse response body
    let body: unknown;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      body = await response.json();
    } else {
      const text = await response.text();
      if (text) {
        try {
          body = JSON.parse(text);
        } catch {
          body = { message: text } satisfies Partial<ApiError>;
        }
      }
    }

    if (!response.ok) {
      throw ApiRequestError.fromResponse(response, body);
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    // Network error or other non-HTTP errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiRequestError("Network error. Please check your internet connection.");
    }

    if (error instanceof Error) {
      throw new ApiRequestError(error.message);
    }

    throw new ApiRequestError("An unexpected error occurred. Please try again.");
  }
}

// Retry logic for transient failures
async function requestWithRetry<T>(
  endpoint: string,
  options: RequestOptions = {},
  maxRetries = 3
): Promise<T> {
  let lastError: ApiRequestError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await request<T>(endpoint, options);
    } catch (error) {
      lastError = error as ApiRequestError;

      // Don't retry client errors (4xx)
      if (lastError.statusCode && lastError.statusCode >= 400 && lastError.statusCode < 500) {
        throw lastError;
      }

      // Don't retry on last attempt
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw lastError!;
}

// Convenience methods
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    requestWithRetry<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    requestWithRetry<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    requestWithRetry<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    requestWithRetry<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    requestWithRetry<T>(endpoint, { ...options, method: "DELETE" }),

  // Non-retrying versions for specific cases
  postNoRetry: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
};
