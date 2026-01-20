"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { 
  Settings, Undo2, EyeOff, CheckSquare, MoveHorizontal, CircleX 
} from "lucide-react";
import { parse, isValid, format as dateFormat } from "date-fns";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "../ui/popover";
import { CalendarDatePicker } from "./ui/calendar-date-picker";
import { DataTableViewOptions } from "./view-options";
import { DataTableExport } from "./data-export";
import type { DataTransformFunction, ExportableData } from "./utils/export-utils";
import type { TableConfig } from "./utils/table-config";
import { formatDate } from "@/utils/format";
import { useRouter, useMatch, useSearch } from "@tanstack/react-router";

// ✅ Utility functions (unchanged)
const getInputSizeClass = (size: 'sm' | 'default' | 'lg'): string => {
  switch (size) {
    case 'sm': return 'h-9';
    case 'lg': return 'h-11';
    default: return '';
  }
};

const getButtonSizeClass = (size: 'sm' | 'default' | 'lg', isIcon = false): string => {
  if (isIcon) {
    switch (size) {
      case 'sm': return 'h-9 w-9';
      case 'lg': return 'h-11 w-11';
      default: return 'h-10 w-10';
    }
  }
  switch (size) {
    case 'sm': return 'h-9 px-3';
    case 'lg': return 'h-11 px-5';
    default: return 'h-10 px-4';
  }
};

const parseDateFromUrl = (dateStr: string): Date | undefined => {
  if (!dateStr || dateStr === 'undefined') return undefined;
  let date = new Date(dateStr);
  if (isValid(date) && !isNaN(date.getTime())) return date;

  const formats = ['MMM dd, yyyy', 'MMM dd yyyy', 'yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy'];
  const decodedStr = decodeURIComponent(dateStr).replace(/\+/g, ' ');

  for (const format of formats) {
    try {
      date = parse(decodedStr, format, new Date());
      if (isValid(date) && !isNaN(date.getTime())) return date;
    } catch { continue; }
  }
  return undefined;
};

type DateRange = { from: Date | undefined; to: Date | undefined };
type UrlDateRange = { from_date?: string; to_date?: string } | null;

const parseDateRangeFromUrl = (urlParam: string | null | undefined): DateRange | null => {
  if (!urlParam) return null;
  try {
    const decoded = decodeURIComponent(urlParam);
    const parsed = JSON.parse(decoded) as UrlDateRange;
    const fromDate = parsed?.from_date ? parseDateFromUrl(parsed.from_date) : undefined;
    const toDate = parsed?.to_date ? parseDateFromUrl(parsed.to_date) : undefined;
    if ((fromDate || toDate) && isValid(fromDate!) && isValid(toDate!)) {
      return { from: fromDate, to: toDate };
    }
  } catch (e) {
    console.error("Error parsing dateRange from URL:", e);
  }
  return null;
};

// ✅ FIXED Interface
interface DataTableToolbarProps<TData extends ExportableData> {
  table: Table<TData>;
  setSearch: (value: string | ((prev: string) => string)) => void;
  setDateRange: (value: { from_date: string; to_date: string } | ((prev: { from_date: string; to_date: string }) => { from_date: string; to_date: string })) => void;
  totalSelectedItems?: number;
  deleteSelection?: () => void;
  getSelectedItems?: () => Promise<TData[]>;
  getAllItems?: () => TData[];
  config: TableConfig;
  resetColumnSizing?: () => void;
  resetColumnOrder?: () => void;
  entityName?: string;
  columnMapping?: Record<string, string>;
  columnWidths?: Array<{ wch: number }>;
  headers?: string[];
  transformFunction?: DataTransformFunction<TData>;
  customToolbarComponent?: React.ReactNode;
  subRowsConfig?: any;
  getSelectedParentsAndSubrows?: () => { parents: TData[]; subrows: any[]; parentIds: any[]; subrowIds: any[] };
  getSelectedParentRows?: () => Promise<TData[]>;
  getSelectedSubRows?: () => Promise<TData[]>;
  totalParentCount?: number;
  totalSubrowCount?: number;
  enableCsv?: boolean;
  enableExcel?: boolean;
  subRowExportConfig?: {
    entityName: string;
    columnMapping: Record<string, string>;
    columnWidths: Array<{ wch: number }>;
    headers: string[];
    transformFunction?: DataTransformFunction<TData>;
  };
}

export function DataTableToolbar<TData extends ExportableData>({
  table,
  setSearch,
  setDateRange,
  totalSelectedItems = 0,
  deleteSelection,
  getSelectedItems,
  getAllItems,
  config,
  resetColumnSizing,
  resetColumnOrder,
  entityName = "items",
  columnMapping,
  columnWidths,
  headers,
  transformFunction,
  customToolbarComponent,
  subRowsConfig,
  getSelectedParentsAndSubrows,
  getSelectedParentRows,
  getSelectedSubRows,
  totalParentCount: totalParentCountProp,
  totalSubrowCount: totalSubrowCountProp,
  enableCsv = true,
  enableExcel = true,
  subRowExportConfig,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const search = useSearch({ strict: false }) as any; // ✅ Type assertion for TanStack Router
  const match = useMatch({ strict: false });
  const pathname = match?.pathname || window.location.pathname;

  const tableFiltered = table.getState().columnFilters.length > 0;
  const tableSearch = (table.getState().globalFilter as string) || "";

  const { parents = [], subrows = [] } = subRowsConfig?.enabled && getSelectedParentsAndSubrows
    ? getSelectedParentsAndSubrows()
    : { parents: [], subrows: [] };

  const parentCount = totalParentCountProp ?? parents.length;
  const subrowCount = totalSubrowCountProp ?? subrows.length;

  // ✅ Search state
  const [localSearch, setLocalSearch] = useState("");
  const isLocallyUpdatingSearch = useRef(false);

  // ✅ Initialize search from URL
  useEffect(() => {
    const searchParam = search?.search || "";
    const decoded = searchParam ? decodeURIComponent(searchParam) : "";
    setLocalSearch(decoded);
  }, [search?.search]);

  // ✅ Sync table search
  useEffect(() => {
    if (isLocallyUpdatingSearch.current || tableSearch === "") return;
    if (tableSearch !== localSearch) setLocalSearch(tableSearch);
  }, [tableSearch]);

  // ✅ Date state
  const [dates, setDates] = useState<DateRange>({ from: undefined, to: undefined });
  const [datesModified, setDatesModified] = useState(false);

  useEffect(() => {
    const dateRangeParam = search?.dateRange;
    const parsedDates = parseDateRangeFromUrl(dateRangeParam ? JSON.stringify(dateRangeParam) : null);
    setDates(parsedDates || { from: undefined, to: undefined });
    setDatesModified(!!dateRangeParam);
  }, [search?.dateRange]);

  // ✅ Refs
  const searchDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dateDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSelectingDates = useRef(false);
  const isResetting = useRef(false);

  useEffect(() => {
    return () => {
      searchDebounceTimerRef.current && clearTimeout(searchDebounceTimerRef.current);
      dateDebounceTimerRef.current && clearTimeout(dateDebounceTimerRef.current);
    };
  }, []);

  const updateSearchParam = useCallback((key: string, value?: string) => {
    router.navigate({
      to: pathname,
      search: (prev: any) => ({ ...prev, [key]: value || undefined }),
      replace: true
    });
  }, [router, pathname]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    isLocallyUpdatingSearch.current = true;
    setLocalSearch(value);

    if (searchDebounceTimerRef.current) clearTimeout(searchDebounceTimerRef.current);

    searchDebounceTimerRef.current = setTimeout(() => {
      const trimmed = value.trim();
      setSearch(trimmed);
      updateSearchParam("search", trimmed || undefined);
      isLocallyUpdatingSearch.current = false;
    }, 500);
  }, [setSearch, updateSearchParam]);

  const handleDateSelect = useCallback(({ from, to }: DateRange) => {
    isSelectingDates.current = true;

    if (!from && !to) {
      setDates({ from: undefined, to: undefined });
      setDatesModified(false);
      setDateRange({ from_date: "", to_date: "" });
      router.navigate({
        to: pathname,
        search: (prev: any) => {
          const { dateRange, ...rest } = prev;
          return rest;
        },
        replace: true
      });
      isSelectingDates.current = false;
      return;
    }

    setDates({ from, to });
    setDatesModified(true);

    if (dateDebounceTimerRef.current) clearTimeout(dateDebounceTimerRef.current);

    dateDebounceTimerRef.current = setTimeout(() => {
      if (from && to && isValid(from) && isValid(to)) {
        const formatted = {
          from_date: dateFormat(from, 'MMM dd, yyyy'),
          to_date: dateFormat(to, 'MMM dd, yyyy')
        };
        setDateRange(formatted);
        router.navigate({
          to: pathname,
          search: (prev: any) => ({ ...prev, dateRange: formatted }),
          replace: true
        });
      }
      isSelectingDates.current = false;
    }, 150);
  }, [setDateRange, router, pathname]);

  // 🔥 PERFECT RESET - CLEARS EVERYTHING
  const handleResetFilters = useCallback(() => {
    if (isResetting.current) return;
    isResetting.current = true;

    try {
      // 1. Reset table IMMEDIATELY
      table.resetColumnFilters();
      table.resetRowSelection();
      table.resetGlobalFilter();
      
      // 2. Reset local state
      setLocalSearch("");
      setSearch("");
      setDates({ from: undefined, to: undefined });
      setDatesModified(false);
      setDateRange({ from_date: "", to_date: "" });

      // 3. Reset columns
      resetColumnSizing?.();
      resetColumnOrder?.();

      // 🔥 4. FORCE CLEAR ALL URL PARAMS (3 methods for guarantee)
      if (config.enableUrlState) {
        // Method 1: Navigate to clean path
        router.navigate({
          to: pathname,
          search: () => ({}), // Empty search object
          replace: true
        });

        // Method 2: Fallback - direct pathname (guaranteed clean)
        setTimeout(() => {
          router.navigate({
            to: pathname,
            replace: true
          });
        }, 50);
      }
    } catch (error) {
      console.error("Reset failed:", error);
    } finally {
      setTimeout(() => {
        isResetting.current = false;
      }, 200);
    }
  }, [table, setSearch, setDateRange, resetColumnSizing, resetColumnOrder, config.enableUrlState, router, pathname]);

  // ✅ Fixed filter detection
  const isFiltered = useMemo(() => {
    const searchKeys = search ? Object.keys(search) : [];
    const hasUrlFilters = searchKeys.some(key => key !== 'page' && search[key]);
    return tableFiltered || !!localSearch.trim() || !!(dates.from || dates.to) || datesModified || hasUrlFilters;
  }, [tableFiltered, localSearch, dates, datesModified, search]);

  const selectedItems = totalSelectedItems > 0 ? new Array(totalSelectedItems).fill({} as TData) : [];
  const allItems = getAllItems ? getAllItems() : [];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {config.enableSearch && (
          <Input
            placeholder={config.searchPlaceholder || `Search ${entityName}...`}
            value={localSearch}
            onChange={handleSearchChange}
            className={`min-w-37.5 lg:w-64 ${getInputSizeClass(config.size)}`}
          />
        )}

        {config.enableDateFilter && (
          <CalendarDatePicker
            date={dates}
            onDateSelect={handleDateSelect}
            className={`w-fit ${getInputSizeClass(config.size)}`}
            variant="outline"
          />
        )}

        {isFiltered && (
          <Button
            variant="outline"
            size={config.size}
            onClick={handleResetFilters}
            className={getButtonSizeClass(config.size)}
          >
            Reset
            <CircleX className="ml-1 size-4 shrink-0" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {customToolbarComponent}
        
        {config.enableExport && (
          <DataTableExport
            table={table}
            data={allItems}
            selectedData={selectedItems}
            getSelectedItems={getSelectedItems}
            entityName={entityName}
            columnMapping={columnMapping}
            columnWidths={columnWidths}
            headers={headers}
            transformFunction={transformFunction}
            size={config.size}
            config={config}
            subRowsConfig={subRowsConfig}
            getSelectedParentRows={getSelectedParentRows}
            getSelectedSubRows={getSelectedSubRows}
            parentCount={parentCount}
            subrowCount={subrowCount}
            enableCsv={enableCsv}
            enableExcel={enableExcel}
            subRowExportConfig={subRowExportConfig}
          />
        )}

        {config.enableColumnVisibility && <DataTableViewOptions table={table} columnMapping={columnMapping} size={config.size} />}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className={getButtonSizeClass(config.size, true)} title="Table Settings">
              <Settings className="size-4 shrink-0" />
              <span className="sr-only">Table settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60" align="end">
            <div className="space-y-2">
              <h4 className="font-medium">Table Settings</h4>
              <div className="grid gap-2">
                {config.enableColumnResizing && resetColumnSizing && (
                  <Button variant="ghost" size={config.size} className="justify-start" onClick={resetColumnSizing}>
                    <Undo2 className="mr-2 h-4 w-4" /> Reset Column Sizes
                  </Button>
                )}
                {resetColumnOrder && (
                  <Button variant="ghost" size={config.size} className="justify-start" onClick={resetColumnOrder}>
                    <MoveHorizontal className="mr-2 h-4 w-4" /> Reset Column Order
                  </Button>
                )}
                {config.enableRowSelection && (
                  <Button
                    variant="ghost"
                    size={config.size}
                    className="justify-start"
                    onClick={() => {
                      table.resetRowSelection();
                      deleteSelection?.();
                    }}
                  >
                    <CheckSquare className="mr-2 h-4 w-4" /> Clear Selection
                  </Button>
                )}
                {!table.getIsAllColumnsVisible() && (
                  <Button variant="ghost" size={config.size} className="justify-start" onClick={() => table.resetColumnVisibility()}>
                    <EyeOff className="mr-2 h-4 w-4" /> Show All Columns
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
