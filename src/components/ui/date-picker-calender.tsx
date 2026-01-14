// components/date-picker-calendar.tsx
"use client";


import {
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfYear,
  format,
  isAfter,
  isBefore,
  startOfYear,
} from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CaptionLabelProps, MonthGridProps } from "react-day-picker";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import { Calendar } from "./calendar";

interface DatePickerCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export function DatePickerCalendar({
  selected,
  onSelect,
  disabled = false,
  startDate = new Date(1980, 0),
  endDate = new Date(2030, 11),
}: DatePickerCalendarProps) {
  const [month, setMonth] = useState(selected || new Date());
  const [isYearView, setIsYearView] = useState(false);

  const years = eachYearOfInterval({
    start: startOfYear(startDate),
    end: endOfYear(endDate),
  });

  return (
    <Calendar
      className="overflow-hidden rounded-md border p-2"
      classNames={{
        month_caption: "ml-2.5 mr-20 justify-start",
        nav: "flex absolute w-fit right-0 items-center",
      }}
      components={{
        CaptionLabel: (props: CaptionLabelProps) => (
          <CaptionLabel
            isYearView={isYearView}
            setIsYearView={setIsYearView}
            {...props}
          />
        ),
        MonthGrid: (props: MonthGridProps) => (
          <MonthGrid
            className={props.className}
            currentMonth={month.getMonth()}
            currentYear={month.getFullYear()}
            endDate={endDate}
            isYearView={isYearView}
            onMonthSelect={(selectedMonth: Date) => {
              setMonth(selectedMonth);
              setIsYearView(false);
            }}
            setIsYearView={setIsYearView}
            startDate={startDate}
            years={years}
          >
            {props.children}
          </MonthGrid>
        ),
      }}
      defaultMonth={selected || new Date()}
      disabled={disabled}
      endMonth={endDate}
      mode="single"
      month={month}
      onMonthChange={setMonth}
      onSelect={onSelect}
      selected={selected}
      startMonth={startDate}
    />
  );
}

interface MonthGridInternalProps {
  className?: string;
  children: React.ReactNode;
  isYearView: boolean;
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
  startDate: Date;
  endDate: Date;
  years: Date[];
  currentYear: number;
  currentMonth: number;
  onMonthSelect: (date: Date) => void;
}

function MonthGrid({
  className,
  children,
  isYearView,
  startDate,
  endDate,
  years,
  currentYear,
  currentMonth,
  onMonthSelect,
}: MonthGridInternalProps) {
  const currentYearRef = useRef<HTMLDivElement>(null);
  const currentMonthButtonRef = useRef<HTMLButtonElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isYearView && currentYearRef.current && scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLElement;

      if (viewport) {
        const yearTop = currentYearRef.current.offsetTop;
        viewport.scrollTop = yearTop;
      }

      setTimeout(() => {
        currentMonthButtonRef.current?.focus();
      }, 100);
    }
  }, [isYearView]);

  return (
    <div className="relative">
      <table className={className}>{children}</table>
      {isYearView && (
        <div className="-mx-2 -mb-2 absolute inset-0 z-20 bg-background">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            {years.map((year) => {
              const months = eachMonthOfInterval({
                start: startOfYear(year),
                end: endOfYear(year),
              });

              const isCurrentYear = year.getFullYear() === currentYear;

              return (
                <div
                  key={year.getFullYear()}
                  ref={isCurrentYear ? currentYearRef : undefined}
                >
                  <CollapsibleYear
                    open={isCurrentYear}
                    title={year.getFullYear().toString()}
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((month) => {
                        const isDisabled =
                          isBefore(month, startDate) || isAfter(month, endDate);
                        const isCurrentMonth =
                          month.getMonth() === currentMonth &&
                          year.getFullYear() === currentYear;

                        return (
                          <Button
                            className="h-7"
                            disabled={isDisabled}
                            key={month.getTime()}
                            onClick={() => onMonthSelect(month)}
                            ref={
                              isCurrentMonth ? currentMonthButtonRef : undefined
                            }
                            size="sm"
                            variant={isCurrentMonth ? "default" : "secondary"}
                          >
                            {format(month, "MMM")}
                          </Button>
                        );
                      })}
                    </div>
                  </CollapsibleYear>
                </div>
              );
            })}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

interface CaptionLabelInternalProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  isYearView: boolean;
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
}

function CaptionLabel({
  children,
  isYearView,
  setIsYearView,
}: CaptionLabelInternalProps) {
  return (
    <Button
      className="-ms-2 flex items-center gap-2 font-medium text-sm hover:bg-transparent data-[state=open]:text-muted-foreground/80 [&[data-state=open]>svg]:rotate-180"
      data-state={isYearView ? "open" : "closed"}
      onClick={() => setIsYearView((prev) => !prev)}
      size="sm"
      type="button"
      variant="ghost"
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className="shrink-0 text-muted-foreground/80 transition-transform duration-200"
      />
    </Button>
  );
}

interface CollapsibleYearProps {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}

function CollapsibleYear({ title, children, open }: CollapsibleYearProps) {
  return (
    <Collapsible className="border-t px-2 py-1.5" defaultOpen={open}>
      <CollapsibleTrigger asChild>
        <Button
          className="flex w-full justify-start gap-2 font-medium text-sm hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
          size="sm"
          variant="ghost"
        >
          <ChevronDownIcon
            aria-hidden="true"
            className="shrink-0 text-muted-foreground/80 transition-transform duration-200"
          />
          {title}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden px-3 py-1 text-sm transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
