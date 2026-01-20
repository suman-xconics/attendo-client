"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { Attendence } from "@/types/db";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useMemo } from "react";
import { useListAttendanceData } from "./utils/data-fetching";

export default function AttendanceTable() {
  const exportConfig = useExportConfig();
  const fetchDataFn = useMemo(() => useListAttendanceData, []);

  return (
    <DataTable<Attendence, unknown>
      getColumns={getColumns}
      fetchDataFn={fetchDataFn}           
      idField="row_id"
      exportConfig={exportConfig}
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      config={{
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: true,
        enableExport: true,
        allowExportNewColumns: true,
        enableUrlState: false, 
        enableColumnFilters: false,
        enableRowSelection: true,
        enableColumnVisibility: true,
        size: "sm",
        columnResizingTableId: "attendance-data-table",
        searchPlaceholder: "Search attendance",
      }}
    />
  );
}
