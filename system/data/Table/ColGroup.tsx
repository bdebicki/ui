import type { TableColumnRole } from "./linked-columns";
import { colStripeClass, colWidthVar } from "./linked-columns";

type TableColGroupProps = {
  columns: TableColumnRole[];
};

export function TableColGroup({ columns }: TableColGroupProps) {
  return (
    <colgroup>
      {columns.map((role, index) => {
        const width = colWidthVar(role);
        if (role === "stripe") {
          return <col key={`${role}-${index}`} className={colStripeClass()} />;
        }
        if (role === "name") {
          return (
            <col
              key={`${role}-${index}`}
              data-col="name"
              style={{ width: "var(--table-col-name-min)" }}
            />
          );
        }
        return (
          <col
            key={`${role}-${index}`}
            data-col={role}
            style={width ? { width } : undefined}
          />
        );
      })}
    </colgroup>
  );
}
