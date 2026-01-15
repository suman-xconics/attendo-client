import { preprocessSearch } from "@/components/data-table/utils";
import { useListAttendance } from "@/hooks/attendance/query";
import type { FPSClientInput } from "@/utils/query/fps-client-builder";


export function useListAttendanceData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date?: string; to_date?: string },
  sortBy: string,
  sortOrder: "asc" | "desc"
) {
  const params: FPSClientInput = {
    page,
    limit: pageSize,
    search: preprocessSearch(search),
    from_date: dateRange.from_date,
    to_date: dateRange.to_date,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  return useListAttendance(params);
}

// Mark this as a React Query hook
useListAttendanceData.isQueryHook = true;