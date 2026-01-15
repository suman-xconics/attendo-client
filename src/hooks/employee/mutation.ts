import { queryKeys } from "@/lib/query/keys";
import { InsertUserSchema, UpdateUserSchema, type User } from "@/types/db";
import type z from "zod";
import { getMutationConfig } from "@/lib/query/strategy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation(
    getMutationConfig<User, { data: z.infer<typeof InsertUserSchema> }>(
      "optimistic",
      {
        mutationFn: async (input: { data: z.infer<typeof InsertUserSchema> }) => {
          const validated = InsertUserSchema.parse(input.data);
          const { data } = await apiClient.post<User>("/employees", validated);
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.users.all.queryKey });
        },
      }
    )
  );
}
export function useCreateEmployeeHR() {
  const queryClient = useQueryClient();

  return useMutation(
    getMutationConfig<User, { data: z.infer<typeof InsertUserSchema> }>(
      "optimistic",
      {
        mutationFn: async (input: { data: z.infer<typeof InsertUserSchema> }) => {
          const validated = InsertUserSchema.parse(input.data);
          const { data } = await apiClient.post<User>("/employees/hr", validated);
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.users.all.queryKey });
        },
      }
    )
  );
}


export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation(
    getMutationConfig<User, {
        id: string;
        data: Partial<z.infer<typeof UpdateUserSchema>>;
    }>(
      "optimistic",
      {
        mutationFn: async (
            input: { id: string; data: Partial<z.infer<typeof UpdateUserSchema>> }
        ) => {
          const validated = UpdateUserSchema.parse(input.data);
          const { data } = await apiClient.put<User>(`/employees/${input.id}`, validated);
          return data;
        },
        onSuccess: (variables) => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.users.details(variables.id).queryKey,
          });
          queryClient.invalidateQueries({ queryKey: queryKeys.users.all.queryKey });
        },
      }
    )
  );
}
