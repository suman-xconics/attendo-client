import type { DataTransformFunction } from "@/components/data-table/utils";
import type { Attendence } from "@/types/db";
import { format } from "date-fns";
import { useMemo } from "react";

/**
 * Export configuration for attendance data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(
    () => ({
      // row_id: "Row ID",
      id_value: "ID Value",
      person_name: "Person Name",
      date: "Date",
      entry_time: "Entry Time",
      exit_time: "Exit Time",
    }),
    []
  );

  // Column widths for Excel export
  const columnWidths = useMemo(
    () => [
      // { wch: 15 }, // Row ID
      { wch: 15 }, // ID Value
      { wch: 25 }, // Person Name
      { wch: 15 }, // Date
      { wch: 20 }, // Entry Time
      { wch: 20 }, // Exit Time
    ],
    []
  );

  // Headers for CSV/Excel export
  const headers = useMemo(
    () => [
      // "row_id",
      "id_value",
      "person_name",
      "date",
      "entry_time",
      "exit_time",
    ],
    []
  );

  // Transformation function for export
  const transformFunction: DataTransformFunction<Attendence> = useMemo(
    () => (row: Attendence) => {
      return {
        // row_id: row.row_id || "",
        id_value: row.id_value || "N/A",
        person_name: row.person_name || "N/A",
        date: row.date ? format(new Date(row.date), "MMM dd, yyyy") : "N/A",
        entry_time: row.entry_time ? format(new Date(row.entry_time), "MMM dd, yyyy hh:mm a") : "N/A",
        exit_time: row.exit_time ? format(new Date(row.exit_time), "MMM dd, yyyy hh:mm a") : "N/A",
      };
    },
    []
  );

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "attendance-logs",
    transformFunction,
  };
}