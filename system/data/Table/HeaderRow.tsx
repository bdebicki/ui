import { cn } from "../../lib/cn";
import { TablePriorityStripeHeader } from "./PriorityStripe";

type TableHeaderRowProps = React.ComponentProps<"tr"> & {
  /** When false, skip the priority stripe spacer (for tables without Table.Row). */
  stripe?: boolean;
};

export function TableHeaderRow({
  className,
  children,
  stripe = true,
  ...props
}: TableHeaderRowProps) {
  return (
    <tr
      className={cn(
        "bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 [&>th]:align-top",
        className,
      )}
      {...props}
    >
      {stripe && <TablePriorityStripeHeader />}
      {children}
    </tr>
  );
}
