"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { CopyValueCell } from "@/components/shared/copy-id-cell";
import { Checkbox } from "@/components/ui/checkbox";
import type { User } from "@/types/db";
import { formatDate } from "@/utils/format";
import type { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./actions";
import { UserStatusBadge } from "@/components/data-table/badge/user-status-badge";

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined
): ColumnDef<User>[] => {
  // Base columns without the select column
  const baseColumns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => <CopyValueCell accessorKey="id" row={row} />,
      
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      size: 150,
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mobile" />
      ),
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      accessorKey: "macAddress",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="MAC Address" />
      ),
      cell: ({ row }) => <CopyValueCell accessorKey="macAddress" row={row} />,
      enableColumnFilter: false,
      enableSorting: false,
    },
      {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserStatusBadge showLabel status={row.getValue("status")} />
        </div>
      ),
      meta: {
        label: "Status",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        const date = formatDate(row.getValue("createdAt"), {}, true);

        return <div className="max-w-full text-left truncate">{date}</div>;
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
