import { cn } from "../../lib/cn";

type StickyActionBarProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Add-row button/form that sits in flow under the table, then pins to the
 * bottom of the viewport (`position: sticky`) once the page is long enough
 * that it would otherwise scroll off-screen.
 */
export function StickyActionBar({ children, className }: StickyActionBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-30 border-t border-zinc-200 bg-[var(--bg-color)]/95 py-3 backdrop-blur-sm pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
