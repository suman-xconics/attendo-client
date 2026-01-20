import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const cacheConfig = {

  realtime: {
    staleTime: 0,
    gcTime: 1000 * 60 * 5, // 5 min
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
  },


  default: {
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 10, // 10 min
    refetchOnWindowFocus: false,
    refetchOnReconnect: "stale",
    retry: 2,
  },


  stable: {
    staleTime: 1000 * 60 * 30, // 30 min
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
  },

  infinite: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 2,
  },
} as const;

export type CacheStrategy = keyof typeof cacheConfig;


export const mutationConfig = {

  optimistic: {
    retry: 2,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 10_000),
    throwOnError: false,
    networkMode: "always" as const,
  },

 
  default: {
    retry: 2,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30_000),
    throwOnError: false,
    networkMode: "online" as const,
  },

  
  critical: {
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30_000),
    throwOnError: true,
    networkMode: "always" as const,
  },

  // Fire and forget mutations (analytics, logs)
  fireAndForget: {
    retry: 0,
    throwOnError: false,
    networkMode: "background" as const,
  },
} as const;

export type MutationStrategy = keyof typeof mutationConfig;

/**
 * Error classification for smarter retry logic
 */
export const classifyError = (error: AxiosError): boolean => {
  if (!error.response) {
    // Network error - retry
    return true;
  }

  const status = error.response.status;

  // Retry on server errors (5xx)
  if (status >= 500) return true;

  // Retry on specific 4xx errors (rate limit, timeout)
  if (status === 408 || status === 429) return true;

  // Don't retry on client errors (4xx except above)
  return false;
};

/**
 * Get query configuration with optional overrides
 */
export function getQueryConfig<TData = unknown>(
  strategy: CacheStrategy = "default",
  customOptions?: Partial<UseQueryOptions<TData, AxiosError>>
): UseQueryOptions<TData, AxiosError> {
  return {
    ...cacheConfig[strategy],
    ...customOptions,
  } as UseQueryOptions<TData, AxiosError>;
}

/**
 * Get mutation configuration with optional overrides
 */
export function getMutationConfig<
  TData = unknown,
  TVariables = unknown,
  TContext = unknown
>(
  strategy: MutationStrategy = "default",
  customOptions?: Partial<
    UseMutationOptions<TData, AxiosError, TVariables, TContext>
  >
): UseMutationOptions<TData, AxiosError, TVariables, TContext> {
  return {
    ...mutationConfig[strategy],
    ...customOptions,
  } as UseMutationOptions<TData, AxiosError, TVariables, TContext>;
}

/**
 * Mutation retry condition - only retry on specific errors
 */
export const shouldRetryMutation = (
  failureCount: number,
  error: AxiosError
): boolean => failureCount <= 3 && classifyError(error);

/**
 * Combined error handler for mutations
 */
export interface MutationErrorContext {
  error: AxiosError;
  failureCount?: number;
  timestamp?: number;
}

export const handleMutationError = (
  context: MutationErrorContext
): {
  isRetryable: boolean;
  message: string;
  code?: string;
} => {
  const { error } = context;

  if (!error.response) {
    return {
      isRetryable: true,
      message: "Network error. Please check your connection.",
      code: "NETWORK_ERROR",
    };
  }

  const status = error.response.status;

  switch (status) {
    case 400:
      return {
        isRetryable: false,
        message: "Invalid request. Please check your input.",
        code: "BAD_REQUEST",
      };
    case 401:
      return {
        isRetryable: false,
        message: "Unauthorized. Please log in again.",
        code: "UNAUTHORIZED",
      };
    case 403:
      return {
        isRetryable: false,
        message: "Access forbidden.",
        code: "FORBIDDEN",
      };
    case 404:
      return {
        isRetryable: false,
        message: "Resource not found.",
        code: "NOT_FOUND",
      };
    case 408:
    case 429:
      return {
        isRetryable: true,
        message: "Request timeout. Retrying...",
        code: "RETRY_AFTER",
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        isRetryable: true,
        message: "Server error. Retrying...",
        code: "SERVER_ERROR",
      };
    default:
      return {
        isRetryable: false,
        message: error.message || "An error occurred.",
        code: "UNKNOWN_ERROR",
      };
  }
};

export type QueryStrategy = keyof typeof cacheConfig;