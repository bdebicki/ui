import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium text-nowrap",
  { variants: {
    tone: {
      neutral: "bg-zinc-100 text-zinc-700",
      muted: "bg-zinc-200/80 text-zinc-600",
      quiet: "bg-zinc-100 text-zinc-500",
      primary: "bg-primary-600 text-white",
      priority: "bg-priority-100 text-priority-700",
      platinum: "bg-platinum-100 text-platinum-700",
    },
    size: {
      xs: "px-1.5 py-0.5 text-xs",
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
    },
  },
  defaultVariants: { tone: "neutral", size: "sm" },
});

function Badge({
  className,
  tone = "neutral",
  size = "sm",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-tone={tone}
      className={cn(badgeVariants({ tone, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
