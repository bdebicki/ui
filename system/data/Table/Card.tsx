import { Card } from "@/components/ui/card";
import { cn } from "../../lib/cn";

type TableCardProps = {
  children: React.ReactNode;
  className?: string;
};

/** Scrollable card that frames a table. */
export function TableCard({ children, className }: TableCardProps) {
  return (
    <Card
      className={cn(
        "overflow-x-auto p-0 rounded-xl border border-zinc-200 bg-white",
        className,
      )}
    >
      {children}
    </Card>
  );
}
