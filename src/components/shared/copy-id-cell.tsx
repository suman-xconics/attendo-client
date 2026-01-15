"use client";


import { IconCheck, IconCopy } from "@tabler/icons-react"; // or use lucide-react icons
import type { Row } from "@tanstack/react-table";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface CopyValueCellProps<TData> {
  row: Row<TData>;
  accessorKey: string;
  hideCopyIcon?: boolean;
}

export function CopyValueCell<TData>({
  row,
  accessorKey,
  hideCopyIcon = false,
}: CopyValueCellProps<TData>) {
  const [isCopied, setIsCopied] = useState(false);
  const value = row.getValue(accessorKey) as string;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy ID");
    }
  };

  return (
    <div className="flex items-center gap-0.5 truncate">
      {value}
     {!hideCopyIcon && (
       <Button
        className="transition-colors"
        onClick={handleCopy}
        size="icon-sm"
        variant="ghost"
      >
        {isCopied ? (
          <IconCheck className="size-4 text-success stroke-[1.5px]" />
        ) : (
          <IconCopy className="size-4 stroke-[1.5px]" />
        )}
      </Button>
     )}
    </div>
  );
}
