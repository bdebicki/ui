import { cn } from "../../lib/cn";
import { variants } from "../../lib/variants";

export type BadgeTone =
  | "neutral"
  | "muted"
  | "quiet"
  | "primary"
  | "priority"
  | "platinum";

const badge = variants({
  base: "inline-flex items-center rounded-full font-medium text-nowrap",
  variants: {
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
  defaults: { tone: "neutral", size: "sm" },
});

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  size?: "xs" | "sm" | "md";
  numeric?: boolean;
  className?: string;
};

export function Badge({
  children,
  tone,
  size,
  numeric = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={badge({
        tone,
        size,
        className: cn(numeric && "tabular-nums", className),
      })}
    >
      {children}
    </span>
  );
}
