"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
  isSameDay
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { cva, type VariantProps} from "class-variance-authority";

import { Button } from "../../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "../../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select";
import { Calendar } from "../../ui/calendar";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const multiSelectVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground text-background",
        link: "underline-offset-4 hover:underline text-background"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface CalendarDatePickerProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  id?: string;
  className?: string;
  date: DateRange;
  closeOnSelect?: boolean;
  numberOfMonths?: 1 | 2;
  yearsRange?: number;
  onDateSelect: (range: { from: Date; to: Date } | { from: undefined; to: undefined }) => void;
}

export const CalendarDatePicker = React.forwardRef<
  HTMLButtonElement,
  CalendarDatePickerProps
>(
  (
    {
      id = "calendar-date-picker",
      className,
      date,
      closeOnSelect = false,
      numberOfMonths = 2,
      yearsRange = 10,
      onDateSelect,
      variant,
      ...props
    },
    ref
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [highlightedPart, setHighlightedPart] = React.useState<string | null>(null);

    const [tempSelection, setTempSelection] = React.useState<DateRange | undefined>(date);
    const isSelectingRef = React.useRef(false);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // **FIX: Initialize month display based on date prop**
    const [monthFrom, setMonthFrom] = React.useState<Date>(() => {
      if (date?.from) return date.from;
      return new Date();
    });
    
    const [monthTo, setMonthTo] = React.useState<Date>(() => {
      if (date?.to && numberOfMonths === 2) return date.to;
      if (date?.from) return date.from;
      return new Date();
    });

    // **FIX: Detect which preset range matches current dates**
    const detectSelectedRange = React.useCallback((from: Date | undefined, to: Date | undefined): string | null => {
      if (!from || !to) return null;

      const today = new Date();
      
      const ranges = [
        { 
          label: "Today", 
          start: today, 
          end: today 
        },
        { 
          label: "Yesterday", 
          start: subDays(today, 1), 
          end: subDays(today, 1) 
        },
        {
          label: "This Week",
          start: startOfWeek(today, { weekStartsOn: 1 }),
          end: endOfWeek(today, { weekStartsOn: 1 })
        },
        {
          label: "Last Week",
          start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
          end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7)
        },
        { 
          label: "Last 7 Days", 
          start: subDays(today, 6), 
          end: today 
        },
        {
          label: "This Month",
          start: startOfMonth(today),
          end: endOfMonth(today)
        },
        {
          label: "Last Month",
          start: startOfMonth(subDays(today, today.getDate())),
          end: endOfMonth(subDays(today, today.getDate()))
        },
        { 
          label: "This Year", 
          start: startOfYear(today), 
          end: endOfYear(today) 
        },
        {
          label: "Last Year",
          start: startOfYear(subDays(today, 365)),
          end: endOfYear(subDays(today, 365))
        }
      ];

      for (const range of ranges) {
        const rangeStart = startOfDay(range.start);
        const rangeEnd = endOfDay(range.end);
        const selectedStart = startOfDay(from);
        const selectedEnd = endOfDay(to);
        
        if (isSameDay(rangeStart, selectedStart) && isSameDay(rangeEnd, selectedEnd)) {
          return range.label;
        }
      }
      
      return null;
    }, []);

    const [selectedRange, setSelectedRange] = React.useState<string | null>(() => {
      // **FIX: Initialize based on actual date prop**
      if (date?.from && date?.to) {
        return detectSelectedRange(date.from, date.to);
      }
      return numberOfMonths === 2 ? null : null;
    });

    // **FIX: Sync with parent date changes**
    React.useEffect(() => {
      if (isSelectingRef.current) {
        return;
      }

      // Handle reset case
      if (!date?.from && !date?.to) {
        setTempSelection(undefined);
        setMonthFrom(new Date());
        setMonthTo(new Date());
        setSelectedRange(null);
        return;
      }

      if (date?.from) {
        setMonthFrom(date.from);
        setTempSelection(date);
        
        // **FIX: Auto-detect which range is selected**
        const detectedRange = detectSelectedRange(date.from, date.to);
        setSelectedRange(detectedRange);
      }
      if (date?.to && numberOfMonths === 2) {
        setMonthTo(date.to);
      } else if (date?.from) {
        setMonthTo(date.from);
      }
    }, [date?.from, date?.to, numberOfMonths, detectSelectedRange]);

    const handleClose = () => {
      setIsPopoverOpen(false);
      isSelectingRef.current = false;
    };

    const handleTogglePopover = () => setIsPopoverOpen((prev) => !prev);

    const selectDateRange = (from: Date, to: Date, range: string) => {
      const startDate = startOfDay(from);
      const endDate = numberOfMonths === 2 ? endOfDay(to) : startDate;
      
      setTempSelection({ from: startDate, to: endDate });
      onDateSelect({ from: startDate, to: endDate });
      setSelectedRange(range);
      setMonthFrom(from);
      setMonthTo(to);
      isSelectingRef.current = false;
      
      if (closeOnSelect) {
        setIsPopoverOpen(false);
      }
    };

    const handleDateSelect = (range: DateRange | undefined) => {
      if (!range || !range.from) {
        setTempSelection(undefined);
        onDateSelect({ from: undefined, to: undefined });
        setSelectedRange(null);
        isSelectingRef.current = false;
        return;
      }

      isSelectingRef.current = true;
      const from = startOfDay(range.from);
      let to = range.to ? endOfDay(range.to) : from;
      
      if (numberOfMonths === 1 && !range.to) {
        to = endOfDay(range.from);
      }
      
      setTempSelection({ from, to });
      
      if (range.to || numberOfMonths === 1) {
        onDateSelect({ from, to });
        setMonthFrom(from);
        setMonthTo(to);
        
        // **FIX: Clear preset selection when manually selecting**
        setSelectedRange(null);
        isSelectingRef.current = false;
        
        if (closeOnSelect) {
          setIsPopoverOpen(false);
        }
      }
    };

    const today = new Date();
    const years = Array.from(
      { length: yearsRange + 1 },
      (_, i) => today.getFullYear() - Math.floor(yearsRange / 2) + i
    );

    const handleMonthChange = (newMonthIndex: number, part: string) => {
      if (newMonthIndex < 0 || newMonthIndex > 11) return;
      setSelectedRange(null);
      isSelectingRef.current = false;
      
      if (part === "from") {
        const year = monthFrom.getFullYear();
        const newMonth = new Date(year, newMonthIndex, 1);
        const from = startOfMonth(newMonth);
        const to = date.to ? endOfDay(date.to) : (numberOfMonths === 2 ? endOfMonth(newMonth) : from);
        
        if (from <= to) {
          setTempSelection({ from, to });
          onDateSelect({ from, to });
          setMonthFrom(newMonth);
        }
      } else {
        const year = monthTo.getFullYear();
        const newMonth = new Date(year, newMonthIndex, 1);
        const from = date.from ? startOfDay(date.from) : startOfMonth(newMonth);
        const to = endOfMonth(newMonth);
        
        if (from <= to) {
          setTempSelection({ from, to });
          onDateSelect({ from, to });
          setMonthTo(newMonth);
        }
      }
    };

    const handleYearChange = (newYear: number, part: string) => {
      if (!years.includes(newYear)) return;
      setSelectedRange(null);
      isSelectingRef.current = false;
      
      if (part === "from") {
        const month = monthFrom.getMonth();
        const newDate = new Date(newYear, month, 1);
        const from = startOfMonth(newDate);
        const to = date.to ? endOfDay(date.to) : (numberOfMonths === 2 ? endOfMonth(newDate) : from);
        
        if (from <= to) {
          setTempSelection({ from, to });
          onDateSelect({ from, to });
          setMonthFrom(newDate);
        }
      } else {
        const month = monthTo.getMonth();
        const newDate = new Date(newYear, month, 1);
        const from = date.from ? startOfDay(date.from) : startOfMonth(newDate);
        const to = endOfMonth(newDate);
        
        if (from <= to) {
          setTempSelection({ from, to });
          onDateSelect({ from, to });
          setMonthTo(newDate);
        }
      }
    };

    const dateRanges = [
      { label: "Today", start: today, end: today },
      { label: "Yesterday", start: subDays(today, 1), end: subDays(today, 1) },
      {
        label: "This Week",
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 })
      },
      {
        label: "Last Week",
        start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
        end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7)
      },
      { label: "Last 7 Days", start: subDays(today, 6), end: today },
      {
        label: "This Month",
        start: startOfMonth(today),
        end: endOfMonth(today)
      },
      {
        label: "Last Month",
        start: startOfMonth(subDays(today, today.getDate())),
        end: endOfMonth(subDays(today, today.getDate()))
      },
      { label: "This Year", start: startOfYear(today), end: endOfYear(today) },
      {
        label: "Last Year",
        start: startOfYear(subDays(today, 365)),
        end: endOfYear(subDays(today, 365))
      }
    ];

    const handleMouseOver = (part: string) => setHighlightedPart(part);
    const handleMouseLeave = () => setHighlightedPart(null);

    const handleWheel = React.useCallback(
      (event: WheelEvent, part: string) => {
        event.preventDefault();
        setSelectedRange(null);
        isSelectingRef.current = false;
        
        const increment = event.deltaY > 0 ? -1 : 1;
        
        if (part === "firstDay") {
          const newDate = new Date(date.from as Date);
          newDate.setDate(newDate.getDate() + increment);
          const to = numberOfMonths === 2 ? date.to as Date : newDate;
          
          if (newDate <= to) {
            setTempSelection({ from: newDate, to });
            onDateSelect({ from: newDate, to });
            setMonthFrom(newDate);
          }
        } else if (part === "firstMonth") {
          const currentMonth = monthFrom.getMonth();
          handleMonthChange(currentMonth + increment, "from");
        } else if (part === "firstYear") {
          handleYearChange(monthFrom.getFullYear() + increment, "from");
        } else if (part === "secondDay" && numberOfMonths === 2) {
          const newDate = new Date(date.to as Date);
          newDate.setDate(newDate.getDate() + increment);
          
          if (newDate >= (date.from as Date)) {
            setTempSelection({ from: date.from as Date, to: newDate });
            onDateSelect({ from: date.from as Date, to: newDate });
            setMonthTo(newDate);
          }
        } else if (part === "secondMonth" && numberOfMonths === 2) {
          const currentMonth = monthTo.getMonth();
          handleMonthChange(currentMonth + increment, "to");
        } else if (part === "secondYear" && numberOfMonths === 2) {
          handleYearChange(monthTo.getFullYear() + increment, "to");
        }
      },
      [date, monthFrom, monthTo, numberOfMonths, onDateSelect]
    );

    React.useEffect(() => {
      const elements = [
        { id: `firstDay-${id}`, part: "firstDay" },
        { id: `firstMonth-${id}`, part: "firstMonth" },
        { id: `firstYear-${id}`, part: "firstYear" },
        { id: `secondDay-${id}`, part: "secondDay" },
        { id: `secondMonth-${id}`, part: "secondMonth" },
        { id: `secondYear-${id}`, part: "secondYear" }
      ];

      const listeners = elements.map(({ id, part }) => {
        const element = document.getElementById(id);
        if (element && highlightedPart === part) {
          const handler = (e: WheelEvent) => handleWheel(e, part);
          element.addEventListener("wheel", handler, { passive: false });
          return { element, handler };
        }
        return null;
      }).filter(Boolean);

      return () => {
        listeners.forEach((listener) => {
          if (listener) {
            listener.element.removeEventListener("wheel", listener.handler);
          }
        });
      };
    }, [highlightedPart, handleWheel, id]);

    const formatWithTz = (date: Date, fmt: string) =>
      formatInTimeZone(date, timeZone, fmt);

    const displayDate = tempSelection || date;

    return (
      <>
        <style>
          {`
            .date-part {
              touch-action: none;
            }
          `}
        </style>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              ref={ref as React.Ref<HTMLButtonElement | HTMLAnchorElement>}
              {...props}
              variant={"secondary"}
              className={cn("w-auto font-satoshi-regular", 
                // multiSelectVariants({ className })
              )
              }
              size="sm"
              onClick={handleTogglePopover}
              suppressHydrationWarning
            >
              <CalendarIcon className="h-4 w-4 stroke-[1.5px]" />
              <span>
                {displayDate?.from ? (
                  displayDate.to && numberOfMonths === 2 ? (
                    <>
                      <span
                        id={`firstDay-${id}`}
                        className={cn(
                          "date-part",
                          highlightedPart === "firstDay" && "underline font-bold"
                        )}
                        onMouseOver={() => handleMouseOver("firstDay")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(displayDate.from, "dd")}
                      </span>{" "}
                      <span
                        id={`firstMonth-${id}`}
                        className={cn(
                          "date-part",
                          highlightedPart === "firstMonth" && "underline font-bold"
                        )}
                        onMouseOver={() => handleMouseOver("firstMonth")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(displayDate.from, "LLL")}
                      </span>
                      ,{" "}
                      <span
                        id={`firstYear-${id}`}
                        className={cn(
                          "date-part",
                          highlightedPart === "firstYear" && "underline font-bold"
                        )}
                        onMouseOver={() => handleMouseOver("firstYear")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(displayDate.from, "y")}
                      </span>
                      {" - "}
                      <span
                        id={`secondDay-${id}`}
                        className={cn(
                          "date-part",
                          highlightedPart === "secondDay" && "underline font-bold"
                        )}
                        onMouseOver={() => handleMouseOver("secondDay")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(displayDate.to, "dd")}
                      </span>{" "}
                      <span
                        id={`secondMonth-${id}`}
                        className={cn(
                          "date-part",
                          highlightedPart === "secondMonth" && "underline font-bold"
                        )}
                        onMouseOver={() => handleMouseOver("secondMonth")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(displayDate.to, "LLL")}
                      </span>
                      ,{" "}
                      <span
                        id={`secondYear-${id}`}
                        className={cn(
                          "date-part",
                          highlightedPart === "secondYear" && "underline font-bold"
                        )}
                        onMouseOver={() => handleMouseOver("secondYear")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(displayDate.to, "y")}
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        id={`firstDay-${id}`}
                        className={cn(
                          "date-part",
                          highlightedPart === "firstDay" && "underline font-bold"
                        )}
                        onMouseOver={() => handleMouseOver("firstDay")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(displayDate.from, "dd")}
                      </span>{" "}
                      <span
                        id={`firstMonth-${id}`}
                        className={cn(
                          "date-part",
                          highlightedPart === "firstMonth" && "underline font-bold"
                        )}
                        onMouseOver={() => handleMouseOver("firstMonth")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(displayDate.from, "LLL")}
                      </span>
                      ,{" "}
                      <span
                        id={`firstYear-${id}`}
                        className={cn(
                          "date-part",
                          highlightedPart === "firstYear" && "underline font-bold"
                        )}
                        onMouseOver={() => handleMouseOver("firstYear")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {formatWithTz(displayDate.from, "y")}
                      </span>
                    </>
                  )
                ) : (
                  <span>Select a date</span>
                )}
              </span>
            </Button>
          </PopoverTrigger>
          {isPopoverOpen && (
            <PopoverContent
              className="w-auto"
              align="start"
              avoidCollisions={false}
              onInteractOutside={handleClose}
              onEscapeKeyDown={handleClose}
              style={{
                maxHeight: "var(--radix-popover-content-available-height)",
                overflowY: "auto"
              }}
            >
              <div className="flex gap-2">
                {numberOfMonths === 2 && (
                  <div className="flex flex-col gap-1 pr-4 text-left border-r border-foreground/10">
                    {dateRanges.map(({ label, start, end }) => (
                      <Button
                        key={label}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "justify-start",
                          selectedRange === label &&
                            "bg-primary text-background hover:text-white hover:bg-primary/90"
                        )}
                        onClick={() => selectDateRange(start, end, label)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2 ml-3">
                      <Select
                        onValueChange={(value: string) => {
                          handleMonthChange(months.indexOf(value), "from");
                        }}
                        value={months[monthFrom.getMonth()]}
                      >
                        <SelectTrigger className="w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, idx) => (
                            <SelectItem key={idx} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value: any) => {
                          handleYearChange(Number(value), "from");
                        }}
                        value={monthFrom.getFullYear().toString()}
                      >
                        <SelectTrigger className="w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year, idx) => (
                            <SelectItem key={idx} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {numberOfMonths === 2 && (
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(value: string) => {
                            handleMonthChange(months.indexOf(value), "to");
                          }}
                          value={months[monthTo.getMonth()]}
                        >
                          <SelectTrigger className="w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month, idx) => (
                              <SelectItem key={idx} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(value: any) => {
                            handleYearChange(Number(value), "to");
                          }}
                          value={monthTo.getFullYear().toString()}
                        >
                          <SelectTrigger className="w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year, idx) => (
                              <SelectItem key={idx} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <div className="flex">
                    <Calendar
                      mode="range"
                      defaultMonth={monthFrom}
                      month={monthFrom}
                      onMonthChange={setMonthFrom}
                      selected={tempSelection}
                      onSelect={handleDateSelect}
                      numberOfMonths={numberOfMonths}
                      showOutsideDays={false}
                      className={className}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          )}
        </Popover>
      </>
    );
  }
);

CalendarDatePicker.displayName = "CalendarDatePicker";
