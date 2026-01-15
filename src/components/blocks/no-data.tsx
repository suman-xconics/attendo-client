import { cn } from "@/lib/utils";
import { Ban } from "lucide-react";

type NoDataBlockProps = {
  className?: string;
  fullPage?: boolean;
};

const NoDataBlock = ({ className, fullPage }: NoDataBlockProps) => (
  <div
    className={cn(
      "flex h-full w-full flex-col items-center justify-center border bg-white",
      className,
      fullPage && "h-[80vh]"
    )}
  >
    <Ban className="mb-2 size-8 text-muted-foreground" />
    {/* <h1 className="-mt-8 font-medium text-secondary-foreground text-xl tracking-wide">
      Oops!
    </h1> */}
    <p className="mt-1 text-center font-medium text-md text-muted-foreground">
      Something went wrong, please try again
    </p>
  </div>
);

export default NoDataBlock;
