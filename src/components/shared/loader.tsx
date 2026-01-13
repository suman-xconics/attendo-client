import { cn } from "@/lib/utils";


type LoaderProps = {
  fullPage?: boolean;
  fullHeight?: boolean;
  className?: string;
};

const Loader = ({ fullPage, fullHeight, className }: LoaderProps) => (
  <div
    className={cn(
      "flex h-full w-full items-center justify-center bg-background",
      fullPage && "min-h-svh w-screen md:min-h-lvh",
      fullHeight && "h-full min-h-[80vh]",
      className
    )}
  >
    <video
      autoPlay
      className="pointer-events-none aspect-square h-auto w-96 select-none object-contain"
      loop
      muted
      playsInline
    >
      <source src="/loader.mp4" type="video/mp4" />
    </video>
  </div>
);

export default Loader;
