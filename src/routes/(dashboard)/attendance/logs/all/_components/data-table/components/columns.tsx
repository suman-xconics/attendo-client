"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { CopyValueCell } from "@/components/shared/copy-id-cell";
import { Checkbox } from "@/components/ui/checkbox";
import type { Attendence } from "@/types/db";
import { formatDate } from "@/utils/format";
import type { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./actions";
import { UserStatusBadge } from "@/components/data-table/badge/user-status-badge";
import { Badge } from "@/components/ui/badge";

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined
): ColumnDef<Attendence>[] => {
  // Base columns without the select column
  const baseColumns: ColumnDef<Attendence>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => <CopyValueCell accessorKey="id" row={row} />,

    },
    // {
    //   accessorKey: "userId",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Employee ID" />
    //   ),
    //   size: 150,
    //   enableColumnFilter: false,
    //   enableSorting: false,
    // },
    {
      accessorKey: "userName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Employee Name" />
      ),
      enableColumnFilter: false,
      enableSorting: false,
    },

    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = formatDate(row.getValue("date"));

        return <div className="max-w-full text-left truncate">{date
          ? date : "-"}</div>;
      },
    },
    {
      accessorKey: "manual",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Manual" />
      ),
      cell: ({ row }) => {
        const manual = row.getValue("manual") ? "Yes" : "No";

        return <Badge
          variant={manual === "Yes" ? "default" : "outline"}
          className="max-w-full text-left truncate rounded-sm!">{manual}</Badge>;
      },
      enableColumnFilter: false,
      enableSorting: false,

    },
    {
      accessorKey: "entryTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Entry Time" />
      ),
      cell: ({ row }) => {
        const date = formatDate(row.getValue("entryTime"), {}, true);

        return <div className="max-w-full text-left truncate">{date
          ? date : "-"}</div>;
      },
    },
    {
      accessorKey: "exitTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Exit Time" />
      ),
      cell: ({ row }) => {
        const date = formatDate(row.getValue("exitTime"), {}, true);

        return <div className="max-w-full text-left truncate">{date ? date : "-"}</div>;
      },
    },

    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => <CellAction data={row.original} />,
      size:40,
      enableResizing: false,
    },
  ];
  // Only include the select column if row selection is enabled
  if (handleRowDeselection !== null) {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <div className="pl-2 truncate">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
              className="cursor-pointer"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="truncate">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                if (value) {
                  row.toggleSelected(true);
                } else {
                  row.toggleSelected(false);
                  // If we have a deselection handler, use it for better cross-page tracking
                  if (handleRowDeselection) {
                    handleRowDeselection(row.id);
                  }
                }
              }}
              aria-label="Select row"
              className="cursor-pointer"
            />
          </div>
        ),
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: 50,
      },
      ...baseColumns,
    ];
  }

  // Return only the base columns if row selection is disabled
  return baseColumns;
};
