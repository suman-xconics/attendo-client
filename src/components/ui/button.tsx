import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Link, type LinkProps } from "@tanstack/react-router"
import { Spinner } from "./spinner"

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary bg-secondary/50 text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700",
        success: "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200",
        error: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-9 gap-1.5 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonBaseProps extends VariantProps<typeof buttonVariants> {
  loading?: boolean
  defaultIcon?: React.ReactNode
  loadingText?: string
  asChild?: boolean
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & {
    href?: never
  }

type ButtonAsLink = ButtonBaseProps &
  Omit<LinkProps, keyof ButtonBaseProps | "className"> &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof LinkProps | keyof ButtonBaseProps
  > & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsLink

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      loading = false,
      variant,
      size,
      defaultIcon,
      loadingText,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const isLink = "href" in props && props.href !== undefined
    const isDisabled = loading || ("disabled" in props && !!props.disabled)

    const content = React.useMemo(() => {
      if (loading) {
        return (
          <>
            {loadingText && <span className="mr-2">{loadingText}</span>}
            <Spinner className="[&_svg]:size-4" />
          </>
        )
      }
      return (
        <>
          {children}
          {defaultIcon}
        </>
      )
    }, [loading, loadingText, children, defaultIcon])

    const computedClassName = cn(
      buttonVariants({ variant, size, className }),
      isDisabled && "opacity-50 pointer-events-none"
    )

    // Render as TanStack Router Link
    if (isLink && !asChild) {
      const { to: href, ...linkProps } = props as ButtonAsLink
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={computedClassName}
          data-slot="button"
          to={href}
          aria-disabled={loading}
          {...linkProps}
        >
          {content}
        </Link>
      )
    }

    // Render as button or Slot
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        data-slot="button"
        className={computedClassName}
        disabled={isDisabled}
        aria-disabled={loading || undefined}
        {...(props as React.ComponentPropsWithoutRef<"button">)}
      >
        {content}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }
