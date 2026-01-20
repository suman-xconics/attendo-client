"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { Attendence } from "@/types/db";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useListAttendanceData } from "./utils/data-fetching";

// ** Import Date Table


export default function AttendanceTable() {
  return (
    <DataTable<Attendence, unknown>
      getColumns={getColumns}
      fetchDataFn={useListAttendanceData}
      idField="row_id"
      exportConfig={useExportConfig()}
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      config={{
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: true,
        enableExport: true,
        enableUrlState: true,
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
