import { TableCell as ShadcnTableCell } from "@/components/ui/table";
import { cn } from "../../lib/cn";

type TablePrimaryCellProps = React.ComponentProps<"td"> & {
  priority?: boolean;
  sticky?: boolean;
};

/** First-column cell; priority accent stripe lives in {@link TablePriorityStripe}. */
export function TablePrimaryCell({
  className,
  priority,
  sticky,
  children,
  ...props
}: TablePrimaryCellProps) {
  return (
    <ShadcnTableCell
      className={cn(
        "align-top",
        priority ? "bg-priority-50" : "bg-white",
        sticky &&
          "sticky left-1 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)]",
        className,
      )}
      {...props}
    >
      {children}
    </ShadcnTableCell>
  );
}
