import { cn } from "../../lib/cn";

/** Width of the sticky priority stripe — keep in sync with PrimaryCell `left-*` offset. */
export const PRIORITY_STRIPE_WIDTH = "w-1 min-w-1 max-w-1";

const stripeBase = cn(
  PRIORITY_STRIPE_WIDTH,
  "sticky left-0 z-20 p-0",
);

type PriorityStripeProps = {
  active?: boolean;
  rowSpan?: number;
};

/** Sticky left edge accent — stays visible when the table scrolls horizontally. */
export function TablePriorityStripe({ active, rowSpan }: PriorityStripeProps) {
  return (
    <td
      rowSpan={rowSpan}
      aria-hidden={!active}
      className={cn(stripeBase, active ? "bg-priority-500" : "bg-transparent")}
    />
  );
}

/** Header spacer matching {@link TablePriorityStripe} column width. */
export function TablePriorityStripeHeader() {
  return (
    <th
      aria-hidden
      className={cn(
        stripeBase,
        "border-b border-zinc-200 bg-zinc-50",
      )}
    />
  );
}
