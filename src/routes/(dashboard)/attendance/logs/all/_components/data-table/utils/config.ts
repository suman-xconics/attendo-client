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
      id: "ID",
      userId: "User ID",
      manual: "Manual Entry",
      rssi: "RSSI",
      date: "Date",
      entryTime: "Entry Time",
      exitTime: "Exit Time",
    }),
    []
  );

  // Column widths for Excel export
  const columnWidths = useMemo(
    () => [
      { wch: 35 }, // ID
      { wch: 30 }, // User ID
      { wch: 40 }, // Manual Entry
      { wch: 20 }, // RSSI
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
      "User ID",
      "Manual Entry",
      "RSSI",
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
        id: row.id,
        userId: row.userId,
        manual: row.manual,
        rssi: row.rssi,
        date: formatDate(row.date),
        entryTime: formatDate(row.entryTime),
        exitTime: row.exitTime ? formatDate(row.exitTime) : "",
      };
    },
    []
  );

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "Full Attendance Logs",
    transformFunction,
  };
}
