"use client";

import {
  IconCheck,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  fieldId: string;
  invalid?: boolean;
}

export function SearchableSelect({
  options,
  value = "",
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  disabled = false,
  fieldId,
  invalid,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          aria-invalid={invalid}
          className={cn(
            "border-border! text-secondary-foreground! h-9 w-full justify-between font-normal",
            invalid && "border-destructive",
            !selectedOption && "text-muted-foreground"
          )}
          disabled={disabled}
          id={fieldId}
          role="combobox"
          type="button"
          variant="outline"
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {value ? (
            <IconCircleCheck className="size-4 shrink-0 text-success" />
          ) : options.length === 0 ? (
            <IconInfoCircle className="size-4 shrink-0 opacity-50 text-muted-foreground" />
          ) : <ChevronDown className="size-4 shrink-0 opacity-50 text-muted-foreground" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command
          filter={(value, search, keywords) => {
            const extendedValue = `${value} ${keywords?.join(" ") || ""}`;
            if (extendedValue.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  keywords={[option.label, option.value]}
                  onSelect={() => {
                    onValueChange?.(option.value);
                    setOpen(false);
                  }}
                  value={option.value}
                >
                  <IconCheck
                    className={cn(
                      "h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
