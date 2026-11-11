import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "rounded-lg text-sm transition disabled:cursor-not-allowed disabled:opacity-40",
  { variants: {
    variant: {
      default: "bg-primary font-medium text-primary-foreground hover:bg-primary-800",
      primary: "bg-primary font-medium text-primary-foreground hover:bg-primary-800",
      secondary: "border border-zinc-200 text-zinc-600 hover:bg-zinc-50",
      ghost: "text-zinc-400 hover:text-zinc-700",
      outline: "border border-zinc-200 text-zinc-600 hover:bg-zinc-50",
      destructive: "bg-destructive font-medium text-white hover:bg-destructive/90",
      link: "text-primary-700 underline-offset-4 hover:underline",
      unstyled: "",
    },
    size: {
      default: "px-3 py-1.5",
      xs: "px-2 py-1 text-xs",
      sm: "px-3 py-1.5",
      md: "px-4 py-2.5",
      lg: "px-6 py-3",
      icon: "inline-flex size-9 items-center justify-center",
      "icon-xs": "inline-flex size-6 items-center justify-center",
      "icon-sm": "inline-flex size-8 items-center justify-center",
      "icon-lg": "inline-flex size-10 items-center justify-center",
      unstyled: "",
    },
  },
  defaultVariants: { variant: "primary", size: "sm" },
});

function Button({
  className,
  variant = "primary",
  size = "sm",
  asChild = false,
  type = "button",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      type={type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
