"use client";


import { cn } from "@/lib/utils";
import { IconCircleX, IconPlus } from "@tabler/icons-react";
import type React from "react";
import { useEffect } from "react";
import {
  type ArrayPath,
  type Control,
  type FieldValues,
  type Path,
  useFieldArray,
} from "react-hook-form";
import { Input } from "./input";
import { Button } from "./button";

interface ArrayInputProps<T extends FieldValues> {
  control: Control<T>;
  name: ArrayPath<T>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  addButtonText?: string;
  emptyMessage?: string;
  orientation?: "horizontal" | "vertical";
  inputProps?: React.ComponentProps<typeof Input>;
}

export function ArrayInput<T extends FieldValues>({
  control,
  name,
  placeholder = "Enter value",
  disabled = false,
  className,
  addButtonText = "Add",
  orientation = "horizontal",
  inputProps,
}: ArrayInputProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Initialize with one empty field if array is empty
  useEffect(() => {
    if (fields.length === 0) {
      append("" as any);
    }
  }, []);

  // Vertical layout
  if (orientation === "vertical") {
    return (
      <div className={cn("w-full space-y-2", className)}>
        {/* Vertical stack of input fields */}
        {fields.map((field, index) => (
          <div className="flex w-full gap-2" key={field.id}>
            <Input
              {...inputProps}
              {...control.register(`${name}.${index}` as Path<T>)}
              className="flex-1"
              disabled={disabled}
              placeholder={placeholder}
              type="text"
            />
            {/* Only show remove button if there's more than one field */}
            {fields.length > 1 && (
              <Button
                disabled={disabled}
                onClick={() => remove(index)}
                size="icon-sm"
                type="button"
                variant="destructive"
              >
                <IconCircleX className="size-4 shrink-0 stroke-[1.5px]" />
              </Button>
            )}
          </div>
        ))}

        {/* Add button - full width with right alignment */}
        <div className="flex w-full justify-end">
          <Button
            className="w-fit"
            disabled={disabled}
            onClick={() => append("" as any)}
            size={"sm"}
            type="button"
            variant="outline"
          >
            <IconPlus className="size-4 shrink-0 stroke-[1.5px]" />
            {addButtonText}
          </Button>
        </div>
      </div>
    );
  }

  // Horizontal layout (grid)
  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Grid container for input fields */}
      <div className="grid w-full grid-cols-4 gap-2">
        {fields.map((field, index) => (
          <div className="col-span-1 flex gap-2" key={field.id}>
            <Input
              {...inputProps}
              {...control.register(`${name}.${index}` as Path<T>)}
              className="flex-1"
              disabled={disabled}
              placeholder={
                index === 0 ? placeholder : `${placeholder} ${index + 1}`
              }
              type="text"
            />
            {/* Only show remove button if there's more than one field */}
            {fields.length > 1 && (
              <Button
                disabled={disabled}
                onClick={() => remove(index)}
                size="icon-sm"
                type="button"
                variant="destructive"
              >
                <IconCircleX className="size-4 shrink-0 stroke-[1.5px]" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Add button row - full width with right alignment */}
      <div className="flex w-full justify-end">
        <Button
          className="w-fit"
          disabled={disabled}
          onClick={() => append("" as any)}
          size={"sm"}
          type="button"
          variant="outline"
        >
          <IconPlus className="size-4 shrink-0 stroke-[1.5px]" />
          {addButtonText}
        </Button>
      </div>
    </div>
  );
}
