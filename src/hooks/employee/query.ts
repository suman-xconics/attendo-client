// hooks/useEmployees.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import type { User } from "@/types/db";
import type { FPSClientInput } from "@/utils/query/fps-client-builder";
import { getQueryConfig } from "@/lib/query/strategy";

interface EmployeeDetailsParams {
  id: string;
}


export function useEmployeeDetails(params: EmployeeDetailsParams, p0?: { enabled: boolean; }) {
  return useQuery(
    getQueryConfig<User>("stable", {
      queryKey: queryKeys.users.details(params.id).queryKey,
      queryFn: async () => {
        const { data } = await apiClient.get<User>(`/employees/${params.id}`);
        return data;
      },
      enabled: !!params.id,
    })
  );
}


export function useListEmployees(params: FPSClientInput) {
  return useQuery(
    getQueryConfig<User[]>("default", {
      queryKey: queryKeys.users.list(params).queryKey,
      queryFn: async () => {
        const { data } = await apiClient.get<User[]>("/employees", {
          params: params
        });
        return data;
      },
      enabled: !!params,
    })
  );
}
