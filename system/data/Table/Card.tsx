import { cn } from "../../lib/cn";

type TableCardProps = {
  children: React.ReactNode;
  className?: string;
};

/** Scrollable card that frames a table. */
export function TableCard({ children, className }: TableCardProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-zinc-200 bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
