import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "muted" | "quiet" | "primary" | "priority" | "platinum";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  size?: "xs" | "sm" | "md";
  numeric?: boolean;
  className?: string;
};

export function Badge({ numeric = false, className, ...props }: BadgeProps) {
  return <ShadcnBadge className={cn(numeric && "tabular-nums", className)} {...props} />;
}
