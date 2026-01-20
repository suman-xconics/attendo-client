import { InsertAttendenceSchema, type Attendence } from "@/types/db";
import type z from "zod";
import { getMutationConfig } from "@/lib/query/strategy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useCreateAttendanceRecord() {
  const queryClient = useQueryClient();

  return useMutation(
    getMutationConfig<Attendence, { data: z.infer<typeof InsertAttendenceSchema> }>(
      "optimistic",
      {
        mutationFn: async (input: { data: z.infer<typeof InsertAttendenceSchema> }) => {
          const validated = InsertAttendenceSchema.parse(input.data);
          const { data } = await apiClient.post<Attendence>("/attendance", validated);
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["attendance"] });
        },
      }
    )
  );
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();

  return useMutation(
    getMutationConfig<void, { id: string }>("optimistic", {
      mutationFn: async (input: { id: string }) => {
        await apiClient.delete<void>(`/attendance/${input.id}`);
      }
      ,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["attendance"],
        });

      },
    })
  );
}