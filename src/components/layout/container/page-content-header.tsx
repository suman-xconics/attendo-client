"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getIcon } from "@/utils/get-icon";
import { formatStringUnderscoreToSpace } from "@/utils/format";
import { useRouter } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";

// Base props shared across all variants
type PageContentHeaderBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> & {
  title?: string;
  variant?: "default" | "compact";
  buttonGroup?: React.ReactNode;
  goBackButton?: boolean;
  singleButton?: boolean;
  showSingleButton?: boolean; // New: controls button visibility
  tabHeaderClassName?: string;
};

// Single button with href navigation
type SingleButtonHrefProps = PageContentHeaderBaseProps & {
  singleButton: true;
  buttonText: string;
  buttonIcon?: string;
  buttonHref: string;
  onAddClick?: never;
};

// Single button with onClick callback
type SingleButtonClickProps = PageContentHeaderBaseProps & {
  singleButton: true;
  buttonText: string;
  buttonIcon?: string;
  buttonHref?: never;
  onAddClick: () => void;
};

// Multiple buttons (button group)
type MultiButtonProps = PageContentHeaderBaseProps & {
  singleButton?: false;
  buttonText?: never;
  buttonIcon?: never;
  buttonHref?: never;
  onAddClick?: never;
};

// Tabs configuration
type TabsProps = {
  isTabs: true;
  tabHeaders: string[];
  onTabChange: (value: string) => void;
  activeTab: string;
  tabHeaderClassName?: string;
};

// No tabs configuration
type NoTabsProps = {
  isTabs?: false;
  tabHeaders?: never;
  onTabChange?: never;
  activeTab?: never;
};

// Final discriminated union types
type PageContentHeaderProps =
  | (SingleButtonHrefProps & NoTabsProps)
  | (SingleButtonClickProps & NoTabsProps)
  | (MultiButtonProps & NoTabsProps)
  | (SingleButtonHrefProps & TabsProps)
  | (SingleButtonClickProps & TabsProps)
  | (MultiButtonProps & TabsProps);

const ContentHeader = (props: PageContentHeaderProps) => {
  const {
    title,
    singleButton,
    buttonText,
    buttonGroup,
    goBackButton,
    className,
    isTabs,
    tabHeaders,
    activeTab,
    onTabChange,
    tabHeaderClassName,
    variant,
    showSingleButton = true, // Default to true
    ...restProps
  } = props;

  // Extract button-specific props and remove them from divProps
  const buttonIcon = props.singleButton
    ? (props.buttonIcon ?? "IconCirclePlus")
    : "IconCirclePlus";
  const buttonHref =
    props.singleButton && "buttonHref" in props ? props.buttonHref : undefined;
  const onAddClick =
    props.singleButton && "onAddClick" in props ? props.onAddClick : undefined;

  // Remove button-specific props from div props
  const {
    buttonIcon: _,
    buttonHref: __,
    onAddClick: ___,
    showSingleButton: ____,
    ...divProps
  } = restProps as any;

  const Icon = getIcon(buttonIcon);
  const router = useRouter()
    const handleGoBack = () => {
    router.history.back();
  };


  return (
    <div
      {...divProps}
      className={cn(
        "flex h-14 w-full shrink-0 items-center justify-between border bg-white px-3",
        className
      )}
    >
      <h1 className="font-medium font-satoshi-medium text-secondary-foreground text-xl">
        {title ?? ""}
      </h1>

      {isTabs && tabHeaders && tabHeaders.length > 0 ? (
        <div className="flex items-center gap-4">
          <Tabs onValueChange={onTabChange} value={activeTab}>
            <TabsList>
              {tabHeaders.map((value) => (
                <TabsTrigger
                  className={cn("text-sm capitalize", tabHeaderClassName)}
                  key={value}
                  value={value}
                >
                  {formatStringUnderscoreToSpace(value)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {goBackButton && (
            <Button
               onClick={handleGoBack}
              size={"sm"}
              variant={"outline"}
            >
              <MoveLeft className="size-5 stroke-[1.5px]" />
              Go Back
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {singleButton && showSingleButton ? (
            <Button
              // href={buttonHref}
              onClick={onAddClick}
              size={"sm"}
            >
              {buttonText}
              <Icon className="size-5 shrink-0 stroke-[1.5px]" />
            </Button>
          ) : (
            (buttonGroup ?? null)
          )}

          {!isTabs && goBackButton && (
            <Button
               onClick={handleGoBack}
              size={"sm"}
              variant={"outline"}
            >
              <MoveLeft className="size-5 stroke-[1.5px]" />
              Go Back
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentHeader;
