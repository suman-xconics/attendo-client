"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { User } from "@/types/db";
import { getColumns } from "./components/columns";
import { useListEmployeeData } from "./utils/data-fetching";
import { useExportConfig } from "./utils/config";

// ** Import Date Table


export default function EmployeeTable() {
  return (
    <DataTable<User, unknown>
      getColumns={getColumns}
      fetchDataFn={useListEmployeeData}
      idField="id"
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
        columnResizingTableId: "employees-data-table",
        searchPlaceholder: "Search employee",
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
      }}
    />
  );
}
