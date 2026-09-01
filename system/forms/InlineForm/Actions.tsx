import { cn } from "../../lib/cn";

type FormActionsProps = {
  children: React.ReactNode;
  className?: string;
};

/** Trailing submit/cancel cluster of an `InlineForm`. */
export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn("flex items-end gap-1.5", className)}>{children}</div>
  );
}
