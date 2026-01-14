"use client";

import { IconCheck, IconX } from "@tabler/icons-react";
import { Badge } from "./badge";
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
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  maxCount?: number;
  fieldId: string;
  invalid?: boolean;
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  disabled = false,
  maxCount = 3,
  fieldId,
  invalid,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onValueChange?.(newValue);
  };

  const handleRemove = (e: React.MouseEvent, valueToRemove: string) => {
    e.stopPropagation();
    onValueChange?.(value.filter((v) => v !== valueToRemove));
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const displayedBadges = selectedOptions.slice(0, maxCount);
  const remainingCount = selectedOptions.length - maxCount;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          aria-invalid={invalid}
          className={cn(
            "border-border! h-9 w-full justify-start",
            invalid && "border-destructive"
          )}
          disabled={disabled}
          id={fieldId}
          role="combobox"
          type="button"
          variant="outline"
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {displayedBadges.map((option) => (
                  <Badge
                    className="mr-1 pt-1"
                    key={option.value}
                    variant="default"
                  >
                    {option.label}
                    <button
                      className="ml-1 rounded-full outline-none"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => handleRemove(e, option.value)}
                      type="button"
                    >
                      <IconX className="size-4" />
                    </button>
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <Badge className="mr-1" variant="secondary">
                    +{remainingCount} more
                  </Badge>
                )}
              </>
            )}
          </div>
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
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    disabled={option.disabled}
                    key={option.value}
                    keywords={[option.label, option.value]}
                    onSelect={() => handleSelect(option.value)}
                    value={option.value}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <IconCheck className="h-4 w-4 text-white" />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
