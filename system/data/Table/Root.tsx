import { Table as ShadcnTable } from "@/components/ui/table";
import { cn } from "../../lib/cn";

type TableRootProps = React.ComponentProps<"table"> & {
  /** Enables fixed layout + shared column widths inside {@link LinkedTableGroup}. */
  linked?: boolean;
};

export function TableRoot({
  linked,
  className,
  ...props
}: TableRootProps) {
  return (
    <ShadcnTable
      data-linked-table={linked ? "" : undefined}
      className={cn(
        "w-full min-w-full border-collapse text-sm [&_td]:align-top [&_th]:align-top",
        className,
      )}
      {...props}
    />
  );
}
