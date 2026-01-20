import type { DataTransformFunction } from "@/components/data-table/utils";
import type { Attendence } from "@/types/db";
import { formatDate } from "@/utils/format";
import { useMemo } from "react";

/**
 * Export configuration for org clients data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(
    () => ({
      row_id: "ID",
      id_value: "Mac Address",
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
      { wch: 35 }, // ID
      { wch: 30 }, // Mac Address
      { wch: 40 }, // Person Name
      { wch: 20 }, // Date
      { wch: 20 }, // Entry Time
      { wch: 20 }, // Exit Time
    ],
    []
  );

  // Headers for CSV export
  const headers = useMemo(
    () => [
      "ID",
      "Mac Address",
      "Person Name",
      "Date",
      "Entry Time",
      "Exit Time",
    ],
    []
  );

  // Transformation function for export
  const transformFunction: DataTransformFunction<Attendence> = useMemo(
    () => (row: Attendence) => {
      return {
        row_id: row.row_id,
        id_value: row.id_value,
        person_name: row.person_name,
        date: formatDate(row.date),
        entry_time: formatDate(row.entry_time, {}, true),
        exit_time: formatDate(row.exit_time, {}, true),
      };
    },
    []
  );

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "Attendance Logs",
    transformFunction,
  };
}
