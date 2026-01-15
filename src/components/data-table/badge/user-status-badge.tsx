import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types/db";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

// Extract the enum values type
type UserStatusType = UserStatus;

// Define status variant styles matching your UserStatus enum
const userStatusBadgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-sm border px-2 py-0.5 font-medium text-xs transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      status: {
        ACTIVE: "border-transparent bg-success/10 text-success",
        INACTIVE: "border-transparent bg-ring/10 text-ring",
        BANNED: "border-transparent bg-tertiary/10 text-tertiary",
        PENDING: "border-transparent bg-warning/10 text-warning",
        DELETED:
          "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive",
      },
    },
    defaultVariants: {
      status: "ACTIVE",
    },
  }
);

// Define dot color variants that match the text color
const dotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    status: {
      ACTIVE: "bg-success",
      INACTIVE: "bg-ring",
      BANNED: "bg-tertiary",
      PENDING: "bg-warning",
      DELETED: "bg-destructive",
    },
  },
  defaultVariants: {
    status: "ACTIVE",
  },
});

interface UserStatusBadgeProps
  extends Omit<React.ComponentProps<"span">, "children">,
    VariantProps<typeof userStatusBadgeVariants> {
  status: UserStatusType;
  showLabel?: boolean;
  showDot?: boolean;
}

function UserStatusBadge({
  className,
  status,
  showLabel = true,
  showDot = true,
  ...props
}: UserStatusBadgeProps) {
  // Format label for display
  const label = showLabel
    ? status.charAt(0) + status.slice(1).toLowerCase()
    : null;

  return (
    <span
      className={cn(
        userStatusBadgeVariants({ status }),
        className,
        "text-[13px]"
      )}
      data-slot="user-status-badge"
      {...props}
    >
      {showDot && (
        <span aria-hidden="true" className={cn(dotVariants({ status }))} />
      )}
      {label}
    </span>
  );
}

export { UserStatusBadge, userStatusBadgeVariants };
export type { UserStatusType };
