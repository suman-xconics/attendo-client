// hooks/useEmployees.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import type { Attendence } from "@/types/db";
import type { FPSClientInput } from "@/utils/query/fps-client-builder";
import { getQueryConfig } from "@/lib/query/strategy";

interface AttendanceDetailsParams {
  id: string;
  enabled?: boolean;
}

export function useAttendanceDetails(params: AttendanceDetailsParams) {
  return useQuery(
    getQueryConfig<Attendence>("stable", {
      queryKey: queryKeys.attendance.details(params.id).queryKey,
      queryFn: async () => {
        const { data } = await apiClient.get<Attendence>(`/attendance/${params.id}`);
        return data;
      },
      enabled: !!params.id && params.enabled !== false,
    })
  );
}

export function useListAttendance(params: FPSClientInput) {
  return useQuery(
    getQueryConfig<Attendence[]>('realtime', {
      queryKey: queryKeys.attendance.list(params).queryKey,
      queryFn: async () => {
        const { data } = await apiClient.get<Attendence[]>("/attendance", {
          params: params
        });
        return data;
      }
    })
  );
}

export const useMyListAttendance = (params: FPSClientInput) => {
  return useQuery(
    getQueryConfig<Attendence[]>("default", {
      queryKey: queryKeys.attendance.list(params).queryKey,
      queryFn: async () => {
        const { data } = await apiClient.get<Attendence[]>("/attendance/my", {
          params: params
        });
        return data;
      }
    })
  );
}

export const useListAttendanceByEmployeeId = (employeeId: string, params: FPSClientInput) => {
  return useQuery(
    getQueryConfig<Attendence[]>("default", {
      queryKey: queryKeys.attendance.list_by_employee(employeeId, params).queryKey,
      queryFn: async () => {
        const { data } = await apiClient.get<Attendence[]>(`/attendance/employee/${employeeId}`, {
          params: params
        });
        return data;
      },
      enabled: !!employeeId,
    })
  );
}