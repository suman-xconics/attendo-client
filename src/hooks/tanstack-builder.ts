// lib/query/hooks.ts
import { apiClient } from "@/lib/api";
import { 
  getQueryConfig, 
  getMutationConfig, 
  type CacheStrategy, 
  type MutationStrategy 
} from"@/lib/query/strategy";
import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  type QueryKey
} from "@tanstack/react-query";
import { z, type ZodSchema } from "zod";


interface ApiQueryConfig<
  TData,
  TVariables = void,
  TError = any
> {
  endpoint: string;
  queryKey: QueryKey;
  schema?: ZodSchema<TVariables>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  defaultStrategy?: CacheStrategy;
}

interface ApiMutationConfig<
  TData,
  TVariables,
  TError = any
> {
  endpoint: string;
  queryKeysToInvalidate: QueryKey[];
  schema?: ZodSchema<TVariables>;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  defaultStrategy?: MutationStrategy;
}

// 🔥 Strategy directly in builder config
export function createApiQueryHook<
  TData,
  TVariables = void
>(config: ApiQueryConfig<TData, TVariables>) {
  return function useApiQuery(
    params?: TVariables,
    options?: Partial<{
      strategy: CacheStrategy;
      enabled: boolean;
    }>
  ) {
    return useQuery({
      ...getQueryConfig<TData>(
        options?.strategy ?? config.defaultStrategy ?? "default"
      ),
      // include params in key so different ids are cached separately
      queryKey: [...config.queryKey, params] as QueryKey,
      queryFn: async () => {
        const validatedParams = config.schema
          ? config.schema.parse(params)
          : params;

        const method = (config.method ?? "GET").toLowerCase() as
          | "get"
          | "post"
          | "put"
          | "patch"
          | "delete";

        // replace :id (and any other path params) from validatedParams
        let endpoint = config.endpoint;
        if (validatedParams && typeof validatedParams === "object") {
          Object.entries(validatedParams as Record<string, any>).forEach(
            ([key, value]) => {
              endpoint = endpoint.replace(`:${key}`, String(value));
            }
          );
        }

        const { data } = await apiClient[method]<TData>(
          endpoint,
          validatedParams
        );
        return data;
      },
      enabled:
        Boolean(params || config.method === "GET") &&
        options?.enabled !== false,
      ...options,
    });
  };
}


// 🔥 Strategy directly in builder config
export function createApiMutationHook<
  TData,
  TVariables
>(config: ApiMutationConfig<TData, TVariables>) {
  return function useApiMutation(options?: {
    strategy?: MutationStrategy;
  }) {
    const queryClient = useQueryClient();

    return useMutation({
      ...getMutationConfig<TData, TVariables>(
        options?.strategy ?? config.defaultStrategy ?? "default"
      ),
      mutationFn: async (variables: TVariables) => {
        const validated = config.schema 
          ? config.schema.parse(variables) 
          : variables;
        
        const method = (config.method ?? 'POST').toLowerCase() as 'post' | 'put' | 'patch' | 'delete';
        const { data } = await apiClient[method]<TData>(
          config.endpoint, 
          validated
        );
        return data;
      },
      onSuccess: () => {
        config.queryKeysToInvalidate.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      },
      ...options,
    });
  };
}
