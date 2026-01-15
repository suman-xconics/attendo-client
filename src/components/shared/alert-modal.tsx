/** biome-ignore-all lint/nursery/noLeakedRender: forced */
"use client";
import { getIcon } from "@/utils/get-icon";
import {
  Button,
  type ButtonProps,
} from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useEffect, useState } from "react";

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  customTitle?: string;
  customText?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  loadingText?: string;
  submitButtonText?: string;
  submitButtonIcon?: string;
  submitButtonVariant?: ButtonProps["variant"];
};

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  customTitle,
  customText,
  disabled,
  children,
  loadingText,
  submitButtonIcon,
  submitButtonText,
  submitButtonVariant,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const Icon = getIcon(submitButtonIcon || "IconTrash");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent className="p-4! py-6!">
        <DialogHeader>
          <DialogTitle className="text-secondary-foreground">
            {customTitle || "Are you sure?"}
          </DialogTitle>
          <DialogDescription>
            {customText || "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        {children}

        <div className="flex w-full items-center justify-end space-x-2 pt-2">
          <Button
            disabled={loading}
            onClick={onClose}
            size={"sm"}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={loading || disabled}
            loading={loading}
            loadingText={loadingText}
            onClick={onConfirm}
            size={"sm"}
            type="button"
            variant={submitButtonVariant || "destructive"}
          >
            {submitButtonText || "Continue"}
            {Icon && <Icon className="size-4 shrink-0" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
