
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type React from "react";


export default function PageContentContainer({
  children,
  scrollable = false,
  noPadding = false,
  className = "",
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  noPadding?: boolean;
  className?: string;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea
          className={cn(
            "mt-15 h-[calc(100dvh-60px)] w-full bg-background",
            className
          )}
        >
          <div
            className={cn(
              "flex flex-col",
              noPadding ? "p-0" : "px-2 py-2"
            )}
          >
            {children}
          </div>
        </ScrollArea>
      ) : (
        <div
          className={cn(
            "mt-15 h-[calc(100dvh-60px)] w-full overflow-auto bg-background",
            noPadding ? "p-0" : "px-2 py-2"
          )}
        >
          <div className={cn("flex flex-col gap-2", className)}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
