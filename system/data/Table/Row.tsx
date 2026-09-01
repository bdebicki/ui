import { cn } from "../../lib/cn";
import { TablePriorityStripe } from "./PriorityStripe";

export type TableRowProps = React.ComponentProps<"tr"> & {
  priority?: boolean;
  /** @internal Injected by {@link TableRowGroup} — do not set manually. */
  stripeRowSpan?: number;
  /** @internal Injected by {@link TableRowGroup} — do not set manually. */
  skipStripe?: boolean;
};

export function TableRow({
  className,
  priority,
  skipStripe,
  stripeRowSpan,
  children,
  ...props
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-zinc-100 last:border-b-0 [&>td]:align-top",
        priority && "bg-priority-50/60 hover:bg-priority-50/80",
        className,
      )}
      {...props}
    >
      {!skipStripe && (
        <TablePriorityStripe active={priority} rowSpan={stripeRowSpan} />
      )}
      {children}
    </tr>
  );
}
