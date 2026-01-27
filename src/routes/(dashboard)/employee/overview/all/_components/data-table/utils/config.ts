import type { DataTransformFunction } from "@/components/data-table/utils";
import type { User } from "@/types/db";
import { formatDate } from "@/utils/format";
import { useMemo } from "react";

/**
 * Export configuration for org clients data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(
    () => ({
      id: "Client ID",
      name: "Client Name",
      email: "Email",
      phoneNumber: "Phone",
      macAddress: "MAC Address",
      createdAt: "Created At",
      updatedAt: "Updated At",
    }),
    []
  );

  // Column widths for Excel export
  const columnWidths = useMemo(
    () => [
      { wch: 35 }, // Client ID
      { wch: 30 }, // Client Name
      { wch: 40 }, // Email
      { wch: 20 }, // Phone
      { wch: 25 }, // MAC Address
      { wch: 20 }, // Created At
      { wch: 20 }, // Updated At
    ],
    []
  );

  // Headers for CSV export
  const headers = useMemo(
    () => [
      "id",
      "name",
      "email",
      "phoneNumber",
      "macAddress",
      "createdAt",
      "updatedAt",
    ],
    []
  );

  // Transformation function for export
  const transformFunction: DataTransformFunction<User> = useMemo(
    () => (row: User) => {
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        macAddress: row.macAddress,
        createdAt: formatDate(row.createdAt, {}, true),
        updatedAt: formatDate(row.updatedAt, {}, true),
      };
    },
    []
  );

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "Employees",
    transformFunction,
  };
}
