import { Children, cloneElement, isValidElement, type ReactElement } from "react";
import type { TableRowProps } from "./Row";

type TableRowGroupProps = {
  /** Applied to every row in the group (unless a row sets its own). */
  priority?: boolean;
  children: React.ReactNode;
};

/**
 * Groups consecutive {@link TableRow} elements that belong to one logical entry
 * (e.g. evolution mobile: Zwykłe / XL / Stardust). Handles priority stripe
 * rowSpan automatically — first row owns the sticky stripe, rest skip it.
 */
export function TableRowGroup({ priority, children }: TableRowGroupProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<
    TableRowProps & { stripeRowSpan?: number; skipStripe?: boolean }
  >[];

  if (rows.length === 0) return null;

  return (
    <>
      {rows.map((row, index) =>
        cloneElement(row, {
          priority: row.props.priority ?? priority,
          stripeRowSpan: index === 0 ? rows.length : undefined,
          skipStripe: index > 0,
        }),
      )}
    </>
  );
}
