"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";
import { useEffect, useState, useRef, useMemo } from "react";
import { Settings, Undo2, EyeOff, CheckSquare, MoveHorizontal, CircleX } from "lucide-react";
import { parse, isValid } from "date-fns";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { CalendarDatePicker } from "./ui/calendar-date-picker";
import { DataTableViewOptions } from "./view-options";
import { DataTableExport } from "./data-export";
import type { DataTransformFunction, ExportableData } from "./utils/export-utils";
import { resetUrlState } from "./utils/deep-utils";
import type { TableConfig } from "./utils/table-config";
import { formatDate } from "@/utils/format";
import { 
  useRouter, 
  useMatch, 
  useSearch 
} from "@tanstack/react-router"; // ✅ Fixed: Correct TanStack Router hooks

const getInputSizeClass = (size: 'sm' | 'default' | 'lg') => {
  switch (size) {
    case 'sm': return 'h-9';
    case 'lg': return 'h-11';
    default: return '';
  }
};

const getButtonSizeClass = (size: 'sm' | 'default' | 'lg', isIcon = false) => {
  if (isIcon) {
    switch (size) {
      case 'sm': return 'h-9 w-9';
      case 'lg': return 'h-11 w-11';
      default: return '';
    }
  }
  switch (size) {
    case 'sm': return 'h-9 px-3';
    case 'lg': return 'h-11 px-5';
    default: return '';
  }
};

// Custom date parser that handles multiple formats
const parseDateFromUrl = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;

  // Try parsing as ISO string first
  let date = new Date(dateStr);
  if (isValid(date)) {
    return date;
  }

  // Try common formats: "Dec 13, 2025", "Dec+13,+2025", etc.
  const formats = [
    'MMM dd, yyyy',
    'MMM+dd,+yyyy',
    'yyyy-MM-dd',
    'MM/dd/yyyy',
  ];

  // Decode URL encoded spaces
  const decodedStr = decodeURIComponent(dateStr).replace(/\+/g, ' ');

  for (const format of formats) {
    try {
      date = parse(decodedStr, format, new Date());
      if (isValid(date)) {
        return date;
      }
    } catch (e) {
      continue;
    }
  }

  console.warn('Failed to parse date:', dateStr);
  return undefined;
};

interface DataTableToolbarProps<TData extends ExportableData> {
  table: Table<TData>;
  setSearch: (value: string | ((prev: string) => string)) => void;
  setDateRange: (
    value:
      | { from_date: string; to_date: string }
      | ((prev: { from_date: string; to_date: string }) => {
          from_date: string;
          to_date: string;
        })
  ) => void;
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
  const search = useSearch({ strict: false }); // ✅ TanStack Router search hook
  const match = useMatch({ strict: false }); // ✅ For pathname
  const pathname = match?.pathname || window.location.pathname; // ✅ Fallback to window.location

  const tableFiltered = table.getState().columnFilters.length > 0;

  const { parents = [], subrows = [] } = subRowsConfig?.enabled && getSelectedParentsAndSubrows
    ? getSelectedParentsAndSubrows()
    : { parents: [], subrows: [] };

  const parentCount = totalParentCountProp !== undefined ? totalParentCountProp : parents.length;
  const subrowCount = totalSubrowCountProp !== undefined ? totalSubrowCountProp : subrows.length;

  const searchParamFromUrl = search?.search || ""; // ✅ Use TanStack Router search
  const decodedSearchParam = searchParamFromUrl
    ? decodeURIComponent(searchParamFromUrl)
    : "";

  const currentSearchFromTable = (table.getState().globalFilter as string) || "";

  const [localSearch, setLocalSearch] = useState(decodedSearchParam || currentSearchFromTable);

  const isLocallyUpdatingSearch = useRef(false);

  useEffect(() => {
    if (isLocallyUpdatingSearch.current) return;

    const searchFromUrl = search?.search || "";
    const decodedSearchFromUrl = searchFromUrl ? decodeURIComponent(searchFromUrl) : "";

    if (decodedSearchFromUrl !== localSearch) {
      setLocalSearch(decodedSearchFromUrl);
    }
  }, [search, localSearch]);

  const tableSearch = (table.getState().globalFilter as string) || "";
  useEffect(() => {
    if (isLocallyUpdatingSearch.current) return;

    if (tableSearch !== localSearch && tableSearch !== "") {
      setLocalSearch(tableSearch);
    }
  }, [tableSearch, localSearch]);

  const isSelectingDates = useRef(false);
  const isResettingDates = useRef(false);

  // URL parsing helper
  const parseDateRangeFromUrl = (urlParam: string | null) => {
    if (!urlParam) return null;
    
    try {
      const decoded = decodeURIComponent(urlParam);
      const parsed = JSON.parse(decoded);
      
      const fromDate = parsed?.from_date ? parseDateFromUrl(parsed.from_date) : undefined;
      const toDate = parsed?.to_date ? parseDateFromUrl(parsed.to_date) : undefined;
      
      if (fromDate && toDate && isValid(fromDate) && isValid(toDate)) {
        return { from: fromDate, to: toDate };
      }
    } catch (e) {
      console.error("Error parsing dateRange from URL:", e, urlParam);
    }
    return null;
  };

  // Initialize with URL dates or undefined
  const [dates, setDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>(() => {
    const dateRangeParam = search?.dateRange;
    const urlDates = parseDateRangeFromUrl(dateRangeParam ? JSON.stringify(dateRangeParam) : null);
    
    return urlDates || { from: undefined, to: undefined };
  });

  const [datesModified, setDatesModified] = useState(() => !!search?.dateRange);

  const isFiltered = useMemo(() => {
    return tableFiltered || !!localSearch || !!(dates.from || dates.to);
  }, [tableFiltered, localSearch, dates.from, dates.to]);

  const searchDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dateDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchDebounceTimerRef.current) {
        clearTimeout(searchDebounceTimerRef.current);
      }
      if (dateDebounceTimerRef.current) {
        clearTimeout(dateDebounceTimerRef.current);
      }
    };
  }, []);

  const updateSearchParam = (key: string, value: string) => {
    router.navigate({
      to: pathname,
      search: (prev: any) => ({ ...prev, [key]: value || undefined }),
      replace: true
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    isLocallyUpdatingSearch.current = true;
    setLocalSearch(value);

    if (searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }

    searchDebounceTimerRef.current = setTimeout(() => {
      const trimmedValue = value.trim();
      setSearch(trimmedValue);
      updateSearchParam("search", trimmedValue); // ✅ Update URL
      searchDebounceTimerRef.current = null;

      setTimeout(() => {
        isLocallyUpdatingSearch.current = false;
      }, 100);
    }, 500);
  };

  const handleDateSelect = ({ from, to }: { from: Date | undefined; to: Date | undefined }) => {
    isSelectingDates.current = true;
    isResettingDates.current = false;

    if (!from && !to) {
      setDates({ from: undefined, to: undefined });
      setDatesModified(false);
      setDateRange({ from_date: "", to_date: "" });
      router.navigate({
        to: pathname,
        search: (prev: { [x: string]: any; dateRange: any; }) => {
          const { dateRange, ...rest } = prev;
          return rest;
        },
        replace: true
      });
      
      setTimeout(() => {
        isSelectingDates.current = false;
      }, 100);
      return;
    }

    setDates({ from, to });
    setDatesModified(true);

    if (dateDebounceTimerRef.current) {
      clearTimeout(dateDebounceTimerRef.current);
    }

    dateDebounceTimerRef.current = setTimeout(() => {
      if (from && to) {
        setDateRange({
          from_date: formatDate(from),
          to_date: formatDate(to),
        });
        router.navigate({
          to: pathname,
          search: (prev: any) => ({
            ...prev,
            dateRange: { from_date: formatDate(from), to_date: formatDate(to) }
          }),
          replace: true
        });
      }
      
      setTimeout(() => {
        isSelectingDates.current = false;
      }, 200);
    }, 150);
  };

  const handleResetFilters = () => {
    isResettingDates.current = true;
    isSelectingDates.current = false;

    table.resetColumnFilters();
    setLocalSearch("");
    setSearch("");
    setDates({ from: undefined, to: undefined });
    setDatesModified(false);
    setDateRange({ from_date: "", to_date: "" });

    if (config.enableUrlState) {
      router.navigate({
        to: pathname,
        search: {},
        replace: true
      });
    }

    setTimeout(() => {
      isResettingDates.current = false;
    }, 100);
  };

  const selectedItems =
    totalSelectedItems > 0
      ? new Array(totalSelectedItems).fill({} as TData)
      : [];

  const allItems = getAllItems ? getAllItems() : [];

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {config.enableSearch && (
          <Input
            placeholder={config.searchPlaceholder || `Search ${entityName}...`}
            value={localSearch}
            onChange={handleSearchChange}
            className={`w-[150px] lg:w-[250px] ${getInputSizeClass(config.size)}`}
          />
        )}

        {config.enableDateFilter && (
          <div className="flex items-center">
            <CalendarDatePicker
              date={{
                from: dates.from,
                to: dates.to,
              }}
              onDateSelect={handleDateSelect}
              className={`w-fit cursor-pointer ${getInputSizeClass(config.size)}`}
              variant="outline"
            />
          </div>
        )}

        {isFiltered && (
          <Button
            variant="outline"
            size={"sm"}
            onClick={handleResetFilters}
            className={getButtonSizeClass(config.size)}
          >
            Reset
            <CircleX className="size-4 shrink-0 stroke-[1.5px]" />
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

        {config.enableColumnVisibility && (
          <DataTableViewOptions
            table={table}
            columnMapping={columnMapping}
            size={config.size}
          />
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size={"icon-lg"}
              className={getButtonSizeClass(config.size, true)}
              title="Table Settings"
            >
              <Settings className="size-4 shrink-0 stroke-[1.5px]" />
              <span className="sr-only">Open table settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 font-satoshi-regular" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Table Settings</h4>
              </div>

              <div className="grid gap-2">
                {config.enableColumnResizing && resetColumnSizing && (
                  <Button
                    variant="secondary"
                    size={config.size}
                    className="justify-start"
                    onClick={(e) => {
                      e.preventDefault();
                      resetColumnSizing();
                    }}
                  >
                    <Undo2 className="mr-2 h-4 w-4" />
                    Reset Column Sizes
                  </Button>
                )}

                {resetColumnOrder && (
                  <Button
                    variant="secondary"
                    size={config.size}
                    className="justify-start"
                    onClick={(e) => {
                      e.preventDefault();
                      resetColumnOrder();
                    }}
                  >
                    <MoveHorizontal className="mr-2 h-4 w-4" />
                    Reset Column Order
                  </Button>
                )}

                {config.enableRowSelection && (
                  <Button
                    variant="secondary"
                    size={config.size}
                    className="justify-start"
                    onClick={(e) => {
                      e.preventDefault();
                      table.resetRowSelection();
                      if (deleteSelection) {
                        deleteSelection();
                      }
                    }}
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Clear Selection
                  </Button>
                )}

                {!table.getIsAllColumnsVisible() && (
                  <Button
                    variant="outline"
                    size={config.size}
                    className="justify-start"
                    onClick={() => table.resetColumnVisibility()}
                  >
                    <EyeOff className="mr-2 h-4 w-4" />
                    Show All Columns
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
