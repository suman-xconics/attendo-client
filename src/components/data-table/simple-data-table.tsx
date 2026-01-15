"use client";

// ** import types
import type {
  ColumnDef,
  ColumnResizeMode,
  Row,
} from "@tanstack/react-table";

// ** import core packages
import {
  type ColumnSizingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

// ** import components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { DataTableResizer } from "./data-table-resizer";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";


interface SimpleDataTableProps<TData> {
  // Required: The data to display (can be partial/undefined fields)
  data: TData[] | Partial<TData>[] | readonly TData[] | readonly Partial<TData>[];

  // Required: Column definitions (accepts any value type)
  columns: ColumnDef<TData, any>[];

  // Optional: Enable column resizing
  enableColumnResizing?: boolean;

  // Optional: ID field for row identification
  idField?: keyof TData;

  // Optional: Row click callback
  onRowClick?: (rowData: TData, rowIndex: number) => void;

  // Optional: Custom className for the container
  className?: string;

  // Optional: Show empty state message
  emptyMessage?: string;

  // Optional: Custom empty state component
  EmptyComponent?: React.ComponentType;

  // Optional: Loading state
  isLoading?: boolean;

  // Optional: Number of skeleton rows to show when loading
  loadingRows?: number;
}

export function SimpleDataTable<TData = any>({
  data,
  columns,
  enableColumnResizing = false,
  idField = "id" as keyof TData,
  onRowClick,
  className,
  emptyMessage,
  EmptyComponent,
  isLoading = false,
  loadingRows = 5,
}: SimpleDataTableProps<TData>) {
  // Column sizing state
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  // Row click handler with conflict prevention
  const handleRowClick = React.useCallback(
    (event: React.MouseEvent, rowData: TData, rowIndex: number) => {
      if (!onRowClick) return;

      // Prevent row click if clicking on interactive elements
      const target = event.target as HTMLElement;
      const isInteractiveElement = target.closest(
        'button, a, input, select, textarea, [role="button"], [role="link"]'
      );

      if (isInteractiveElement) {
        return;
      }

      onRowClick(rowData, rowIndex);
    },
    [onRowClick]
  );

  // Memoize table configuration
  const tableOptions = useMemo(
    () => ({
      data: data as TData[],
      columns,
      state: {
        columnSizing,
      },
      columnResizeMode: "onChange" as ColumnResizeMode,
      onColumnSizingChange: setColumnSizing,
      enableColumnResizing,
      getCoreRowModel: getCoreRowModel<TData>(),
      // Use idField for row IDs if available
      getRowId: (row: TData, index: number) => {
        const id = (row as any)[idField];
        return id !== undefined && id !== null ? String(id) : String(index);
      },
    }),
    [data, columns, columnSizing, enableColumnResizing, idField]
  );

  // Set up the table
  const table = useReactTable<TData>(tableOptions);

  return (
    <div className={cn("bg-white font-satoshi-regular border", className)}>
      <ScrollArea className="rounded-md">
        <div className="table-container" aria-label="Data table">
          <Table className={cn(enableColumnResizing ? "resizable-table" : "")}>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="px-2 py-2 relative text-left group/th"
                      key={header.id}
                      colSpan={header.colSpan}
                      scope="col"
                      style={{
                        width: header.getSize(),
                      }}
                      data-column-resizing={
                        header.column.getIsResizing() ? "true" : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      {enableColumnResizing && header.column.getCanResize() && (
                        <DataTableResizer header={header} table={table} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: loadingRows }).map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                    {columns.map((_, j) => (
                      <TableCell key={`loading-cell-${i}-${j}`} className="px-4 py-2">
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    id={`row-${rowIndex}`}
                    data-row-index={rowIndex}
                    onClick={(event) => {
                      if (onRowClick) {
                        handleRowClick(event, row.original, rowIndex);
                      }
                    }}
                    style={{
                      cursor: onRowClick ? "pointer" : undefined,
                    }}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        className="px-4 py-2 truncate max-w-0 text-left"
                        key={cell.id}
                        id={`cell-${rowIndex}-${cellIndex}`}
                        data-cell-index={cellIndex}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="bg-primary-foreground text-center py-8"
                    colSpan={columns.length}
                  >
                    {EmptyComponent ? (
                      <EmptyComponent />
                    ) : (
                      <div>
                        <Inbox className="mx-auto my-10 size-8 text-muted-foreground" />
                        {emptyMessage && (
                          <p className="mt-4 text-muted-foreground">
                            {emptyMessage}
                          </p>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

// Export type for external use
export type { SimpleDataTableProps };