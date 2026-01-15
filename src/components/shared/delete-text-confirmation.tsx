/** biome-ignore-all lint/performance/noNamespaceImport: forced */
import { IconCheck, IconCopy } from "@tabler/icons-react";

import * as React from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button, type ButtonProps } from "../ui/button";
import { Input } from "../ui/input";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  inputLabel: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  actionLabel?: string;
  actionLabelLoading?: string;
  confirmButtonVariant?: ButtonProps["variant"];
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText,
  inputLabel,
  onOpenChange,
  onConfirm,
  loading = false,
  actionLabel,
  actionLabelLoading,
  confirmButtonVariant,
}: ConfirmDialogProps) {
  const [input, setInput] = React.useState("");
  const [isCopied, setIsCopied] = React.useState(false);
  const canDelete = input === confirmText;

  React.useEffect(() => {
    if (!open) {
      setInput("");
      setIsCopied(false);
    }
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(confirmText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch (_error: any) {
      toast.error("Failed to copy");
    }
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent className="font-satoshi-regular">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="-mt-1">
          <div className="mb-1 flex items-center justify-between">
            <div className="font-medium text-secondary-foreground text-sm">
              To confirm, type{" "}
              <span className="inline-flex items-center gap-1.5 font-semibold">
                {inputLabel}
              </span>{" "}
            </div>
            <Button
              className="transition-colors"
              onClick={handleCopy}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              {isCopied ? (
                <IconCheck className="size-4 text-success" />
              ) : (
                <IconCopy className="size-4" />
              )}
            </Button>
          </div>
          <Input
            autoFocus
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here..."
            value={input}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            disabled={!canDelete || loading}
            loading={loading}
            loadingText={actionLabelLoading}
            onClick={onConfirm}
            size="sm"
            variant={confirmButtonVariant || "destructive"}
          >
            {actionLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
