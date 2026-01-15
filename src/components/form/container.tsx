"use client";

import { useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { getIcon } from "@/utils/get-icon";
import { cn } from "@/lib/utils";

interface FormContainerProps<TFormValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "form" | "popover"> {
  editMode: boolean;
  children: React.ReactNode;
  className?: string;
  formId?: string;
  form: UseFormReturn<TFormValues>;
  cancelButton?: boolean;
  resetButton?: boolean;
  submitButton?: boolean;
  submitButtonText?: string;
  submitButtonIcon?: string;
  resetButtonIcon?: string;
  submitButtonLoading?: boolean;
  submitButtonLoadingText?: string;
  submitButtonClassName?: string;
  onReset?: () => void;
  popover?: "auto" | "manual" | "hint"; // Add this line
}

const FormContainer = <TFormValues extends FieldValues = FieldValues>({
  children,
  className,
  editMode,
  formId,
  form,
  cancelButton,
  resetButton,
  submitButton = true,
  submitButtonText = "Create",
  submitButtonLoading = false,
  submitButtonLoadingText = "Creating",
  submitButtonIcon,
  resetButtonIcon,
  submitButtonClassName,
  onReset,
  ...props
}: FormContainerProps<TFormValues>) => {
  const [isRotating, setIsRotating] = useState(false);
  const { popover, ...restProps } = props;
  const Icon = getIcon(
    submitButtonIcon ? submitButtonIcon : editMode ? "IconCircleCheck" : "IconCirclePlus"
  );
  const ResetIcon = getIcon(resetButtonIcon || "IconRotateClockwise2");

  const handleReset = () => {
    setIsRotating(true);
    form.reset();
    onReset?.();
    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  };

  const formElementId = formId;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-2 border bg-white p-2 md:px-4 md:py-6",
        className
      )}
    >
      <form
        {...restProps}
        className={cn(
          className,
          "grid w-full grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4"
        )}
        id={formElementId}
      >
        {children}
      </form>
      <Field className="mt-4 w-full justify-end" orientation="horizontal">
        {resetButton && (
          <Button
            className="cursor-pointer"
            onClick={handleReset}
            size={"sm"}
            type="button"
            variant="outline"
          >
            Reset{" "}
            <ResetIcon
              className={cn(
                "size-5 shrink-0 stroke-[1.5px] transition-transform",
                isRotating && "reset-icon-rotating"
              )}
            />
          </Button>
        )}
        {submitButton && (
          <Button
            className={cn("cursor-pointer", submitButtonClassName)}
            form={formElementId}
            loading={submitButtonLoading}
            loadingText={submitButtonLoadingText}
            size={"sm"}
            type="submit"
          >
            {submitButtonText}{" "}
            <Icon className="size-5 shrink-0 stroke-[1.5px]" />
          </Button>
        )}
      </Field>
    </div>
  );
};

export default FormContainer;
