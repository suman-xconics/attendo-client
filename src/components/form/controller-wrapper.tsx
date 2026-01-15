/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: forced */
"use client";


import { formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Button, buttonVariants } from "../ui/button";
import type { ComponentProps } from "react";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { IconCircleCheck } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { getIcon } from "@/utils/get-icon";
import { ArrayInput } from "../ui/array-input";
import { MultiSelect } from "../ui/multi-select";
import { SearchableSelect } from "../ui/search-select";
import { DatePickerCalendar } from "../ui/date-picker-calender";

type InputType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "number"
  | "url"
  | "date";

interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  labelInfo?: ReactNode;
  fieldId: string;
  className?: string;
  disabled?: boolean;
  description?: string;
  hideField?: boolean;
  hideLabel?: boolean;
  descriptionClassName?: string;
}

interface InputFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "input";
  hideField?: boolean;
  inputType?: InputType;
  isGroupButton?: boolean;
  buttonText?: string;
  buttonIcon?: string;
  hideIcon?: boolean;
  enterValueCheck?: boolean;
  isInputLoading?: boolean;
  isInputSuccess?: boolean;
  buttonVarient?: ComponentProps<typeof Button>["variant"];
  onEnterValue?: (value: string) => void;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputProps?: Omit<
    ComponentProps<typeof Input>,
    "id" | "type" | "placeholder"
  >;
}

interface ArrayInputFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  type: "array-input";
  placeholder?: string;
  addButtonText?: string;
  emptyMessage?: string;
  orientation?: "horizontal" | "vertical"; // Add this line
  inputProps?: Omit<ComponentProps<typeof Input>, "id" | "placeholder">;
}

interface TextareaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  textareaProps?: Omit<
    ComponentProps<typeof Textarea>,
    "id" | "placeholder" | "rows"
  >;
}

type SelectOption = {
  label: string;
  value: string;
};

interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "select";
  placeholder?: string;
  options: SelectOption[];
  searchEnabled?: boolean;
  searchPlaceholder?: string;
  selectProps?: Omit<ComponentProps<typeof Select>, "value" | "onValueChange">;
}

interface MultiSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface MultiSelectFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  type: "multiselect";
  placeholder?: string;
  options: MultiSelectOption[];
  maxCount?: number;
  searchPlaceholder?: string;
}

interface CreatableSelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "creatable-select";
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  addOptionLabel?: string;
  onCreateValue?: (value: string) => void;
}


interface JsonFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "json";
  placeholder?: string;
  prettifyOnBlur?: boolean;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  onValidJsonChange?: (parsedValue: any) => void;
  storeAsString?: boolean;
}

interface CustomFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "custom";
  render: (field: any) => ReactNode;
}

interface CheckboxFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "checkbox";
  checkboxLabel?: string;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkboxProps?: Omit<
    ComponentProps<typeof Checkbox>,
    "checked" | "onCheckedChange"
  >;
}

interface SwitchFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "switch";
  switchLabel?: string;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  switchProps?: Omit<
    ComponentProps<typeof Switch>,
    "checked" | "onCheckedChange"
  >;
}

interface DateFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "date";
  placeholder?: string;
  startDate?: Date;
  endDate?: Date;
  displayFormat?: string;
  datePickerProps?: Omit<
    ComponentProps<typeof DatePickerCalendar>,
    "selected" | "onSelect" | "disabled"
  >;
}

// New Radio Field Props
interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "radio";
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  radioGroupProps?: Omit<
    ComponentProps<typeof RadioGroup>,
    "value" | "onValueChange"
  >;
}

// Update the FormFieldProps union type to include RadioFieldProps
type FormFieldProps<T extends FieldValues> =
  | InputFieldProps<T>
  | CreatableSelectFieldProps<T>
  | TextareaFieldProps<T>
  | SelectFieldProps<T>
  | MultiSelectFieldProps<T>
  | JsonFieldProps<T>
  | CheckboxFieldProps<T>
  | SwitchFieldProps<T>
  | DateFieldProps<T>
  | RadioFieldProps<T>
  | ArrayInputFieldProps<T>
  | CustomFieldProps<T>;

export function FormControllerWrapper<T extends FieldValues>(
  props: FormFieldProps<T>
) {
  const {
    control,
    name,
    label: providedLabel,
    labelInfo,
    fieldId,
    className,
    description,
    descriptionClassName,
  } = props;

  const label =
    providedLabel ??
    (() => {
      const rawSegment = String(name).split(".").pop() ?? String(name);
      const withSpaces = rawSegment
        .replace(/[_-]+/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2");
      return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    })();

  return (
    <Controller
      control={control}
      disabled={props.disabled}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          suppressHydrationWarning
          className={cn(className, "col-span-1", props.hideField && "hidden")}
          data-invalid={fieldState.invalid}
        >
          {!props.hideLabel && (
            <FieldLabel className="-mb-1 flex items-center gap-2 font-satoshi-medium" htmlFor={fieldId}>
              <span>{label}</span>
              {labelInfo && (
                labelInfo
              )}
            </FieldLabel>
          )}

          {props.type === "input" &&
            !props.isGroupButton &&
            !props.enterValueCheck && (
              <Input
                {...field}
                {...props.inputProps}
                aria-invalid={fieldState.invalid}
                autoComplete={props.autoComplete || "off"}
                id={fieldId}
                onChange={(e) => {
                  const value = e.target.value;
                  if (props.inputType === "number") {
                    field.onChange(value === "" ? "" : Number(value));
                  } else {
                    field.onChange(value);
                  }
                }}
                placeholder={props.placeholder}
                type={props.inputType || "text"}
              />
            )}

          {props.type === "input" && props.enterValueCheck && (
            <div className="relative w-full">
              <Input
                {...field}
                className={cn("", props.isInputSuccess && "border-success!")}
                {...props.inputProps}
                aria-invalid={fieldState.invalid}
                autoComplete={props.autoComplete || "off"}
                disabled={props.isInputLoading}
                id={fieldId}
                onChange={(e) => {
                  const value = e.target.value;
                  if (props.inputType === "number") {
                    const numValue = value === "" ? "" : Number(value);
                    field.onChange(numValue);
                    props.onEnterValue?.(value);
                  } else {
                    field.onChange(value);
                    props.onEnterValue?.(value);
                  }
                }}
                placeholder={props.placeholder}
                type={props.inputType || "text"}
              />
              <div className="-translate-y-1/2 absolute top-1/2 right-3">
                {props.isInputLoading && <Spinner className="size-4" />}
                {!props.isInputLoading && props.isInputSuccess && (
                  <IconCircleCheck className="size-5 shrink-0 stroke-[1.5px] text-success" />
                )}
              </div>
            </div>
          )}

          {props.type === "input" &&
            props.isGroupButton &&
            (() => {
              const Icon = getIcon(props.buttonIcon || "IconNorthStar");
              return (
                <div className="flex w-full">
                  <Input
                    {...field}
                    {...props.inputProps}
                    aria-invalid={fieldState.invalid}
                    autoComplete={props.autoComplete || "off"}
                    className={cn("flex-1 rounded-r-none",
                      props.buttonVarient === "secondary" && "border-r-transparent"
                    )}
                    id={fieldId}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (props.inputType === "number") {
                        field.onChange(value === "" ? "" : Number(value));
                      } else {
                        field.onChange(value);
                      }
                    }}
                    placeholder={props.placeholder}
                    type={props.inputType || "text"}
                  />
                  <Button
                    disabled={props.buttonDisabled}
                    onClick={props.onButtonClick}
                    size="icon-sm"
                    className="rounded-l-none"
                    variant={
                      props.buttonVarient
                        ? props.buttonVarient
                        : "default"
                    }
                    type="button"
                  >
                    {props.buttonText}
                    {!props.hideIcon && <Icon className="size-4" />}
                  </Button>
                </div>
              );
            })()}

          {props.type === "array-input" && (
            <ArrayInput
              addButtonText={props.addButtonText}
              control={control}
              disabled={props.disabled}
              emptyMessage={props.emptyMessage}
              inputProps={props.inputProps}
              name={name as any}
              orientation={props.orientation} // Add this line
              placeholder={props.placeholder}
            />
          )}


          {props.type === "switch" && (
            <div className="flex items-center justify-between gap-4">
              {description && <p className="flex-1 text-sm font-satoshi-regular">{description}</p>}
              <Switch
                {...props.switchProps}
                checked={!!field.value}
                disabled={props.disabled}
                id={fieldId}
                onCheckedChange={(checked) => {
                  const nextChecked = Boolean(checked);
                  field.onChange(nextChecked);
                  props.onCheckedChange?.(nextChecked);
                }}
              />
            </div>
          )}

          {props.type === "textarea" && (
            <Textarea
              className="resize-none! h-25"
              {...field}
              {...props.textareaProps}
              aria-invalid={fieldState.invalid}
              id={fieldId}
              placeholder={props.placeholder}
              rows={props.rows || 4}
            />
          )}

          {props.type === "select" && !props.searchEnabled && (
            <Select
              {...props.selectProps}
              disabled={props.disabled || props.options.length === 0}
              onValueChange={(val) => {
                let next: unknown = val;

                if (typeof field.value === "boolean") {
                  next = val === "true";
                }

                field.onChange(next);
              }}
              value={
                typeof field.value === "boolean"
                  ? String(field.value)
                  : (field.value ?? "")
              }
            >
              <SelectTrigger aria-invalid={fieldState.invalid} id={fieldId}>
                <SelectValue
                  placeholder={
                    props.options.length === 0
                      ? "No options available"
                      : props.placeholder || "Select an option"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {props.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {props.type === "select" && props.searchEnabled && (
            <SearchableSelect
              disabled={props.disabled || props.options.length === 0}
              fieldId={fieldId}
              invalid={fieldState.invalid}
              onValueChange={(val:any) => {
                let next: unknown = val;

                if (typeof field.value === "boolean") {
                  next = val === "true";
                }

                field.onChange(next);
              }}
              options={props.options}
              placeholder={
                props.options.length === 0
                  ? "No options available"
                  : props.placeholder || "Select an option"
              }
              searchPlaceholder={props.searchPlaceholder || "Search..."}
              value={
                typeof field.value === "boolean"
                  ? String(field.value)
                  : (field.value ?? "")
              }
            />
          )}


          {props.type === "multiselect" && (
            <MultiSelect
              disabled={props.disabled}
              fieldId={fieldId}
              invalid={fieldState.invalid}
              maxCount={props.maxCount}
              onValueChange={field.onChange}
              options={props.options}
              placeholder={props.placeholder}
              searchPlaceholder={props.searchPlaceholder}
              value={Array.isArray(field.value) ? field.value : []}
            />
          )}
          {props.type === "checkbox" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                {...props.checkboxProps}
                checked={!!field.value}
                disabled={props.disabled}
                id={fieldId}
                onCheckedChange={(checked) => {
                  const nextChecked = Boolean(checked);
                  field.onChange(nextChecked);
                  props.onCheckedChange?.(nextChecked);
                }}
              />
              {props.checkboxLabel && (
                <label
                  className="cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor={fieldId}
                >
                  {props.checkboxLabel}
                </label>
              )}
            </div>
          )}

          {props.type === "date" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={props.disabled}
                  type="button"
                  size={"sm"}
                  variant={"secondary"}
                >
                  <CalendarIcon className="size-4 shrink-0 stroke-[1.5px]" />
                  {field.value ? (
                    formatDate(field.value, props.displayFormat || "PPP")
                  ) : (
                    <span>{props.placeholder || "Pick a date"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <DatePickerCalendar
                  {...props.datePickerProps}
                  disabled={props.disabled}
                  endDate={props.endDate}
                  onSelect={field.onChange}
                  selected={field.value}
                  startDate={props.startDate}
                />
              </PopoverContent>
            </Popover>
          )}

          {/* New Radio Field Type */}
          {props.type === "radio" && (
            <RadioGroup
              {...props.radioGroupProps}
              className={cn(
                "gap-3",
                props.orientation === "horizontal" && "flex flex-row"
              )}
              disabled={props.disabled}
              onValueChange={field.onChange}
              value={field.value ?? ""}
            >
              {props.options.map((option) => (
                <div className="flex items-center space-x-2" key={option.value}>
                  <RadioGroupItem
                    disabled={props.disabled || option.disabled}
                    id={`${fieldId}-${option.value}`}
                    value={option.value}
                  />
                  <Label
                    className="cursor-pointer font-normal"
                    htmlFor={`${fieldId}-${option.value}`}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {props.type === "custom" && props.render(field)}

          {description && !fieldState.invalid && (
            <p
              className={cn(
                "text-muted-foreground text-sm",
                descriptionClassName
              )}
            >
              {description}
            </p>
          )}

          {fieldState.invalid && (
            <FieldError className="-mt-1" errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}
