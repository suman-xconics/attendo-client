import { preprocessSearch } from "@/components/data-table/utils";
import { useListEmployees } from "@/hooks/employee/query";
import type { FPSClientInput } from "@/utils/query/fps-client-builder";


export function useListEmployeeData(
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

  return useListEmployees(params);
}

// Mark this as a React Query hook
useListEmployeeData.isQueryHook = true;