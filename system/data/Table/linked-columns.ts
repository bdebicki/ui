import { cn, type ClassValue } from "../../lib/cn";
import { PRIORITY_STRIPE_WIDTH } from "./PriorityStripe";
import { colFixed, colFlexible } from "./columns";

/** Semantic column roles for linked tables sharing widths via CSS variables. */
export type TableColumnRole =
  | "stripe"
  | "name"
  | "sep"
  | "needed"
  | "have"
  | "remaining"
  | "actions"
  | "status"
  | "inProgress"
  | "target";

export const EVOLUTION_DESKTOP_COLUMNS: TableColumnRole[] = [
  "stripe",
  "name",
  "sep",
  "needed",
  "have",
  "remaining",
  "sep",
  "needed",
  "have",
  "remaining",
  "sep",
  "needed",
  "remaining",
  "actions",
];

export const EVOLUTION_MOBILE_COLUMNS: TableColumnRole[] = [
  "stripe",
  "name",
  "sep",
  "needed",
  "have",
  "remaining",
  "actions",
];

export const MEDALS_COLUMNS: TableColumnRole[] = [
  "stripe",
  "name",
  "status",
  "have",
  "inProgress",
  "target",
  "remaining",
  "actions",
];

const COLUMN_WIDTH_VAR: Partial<Record<TableColumnRole, string>> = {
  name: "--table-col-name-min",
  sep: "--table-col-sep",
  needed: "--table-col-needed",
  have: "--table-col-have",
  remaining: "--table-col-remaining",
  actions: "--table-col-actions",
  status: "--table-col-status",
  inProgress: "--table-col-in-progress",
  target: "--table-col-target",
};

/** CSS custom property name for a fixed-width column role. */
export function colCssVarName(role: TableColumnRole): string | undefined {
  return COLUMN_WIDTH_VAR[role];
}

/** CSS variable-backed width for `<col>` — undefined for stripe/name. */
export function colWidthVar(role: TableColumnRole): string | undefined {
  const name = COLUMN_WIDTH_VAR[role];
  return name ? `var(${name})` : undefined;
}

export function colStripeClass() {
  return PRIORITY_STRIPE_WIDTH;
}

/** Cell/header props: `data-col` + layout classes (linked vs auto table). */
export function colRole(
  role: TableColumnRole,
  linked: boolean,
  ...classes: ClassValue[]
) {
  return {
    "data-col": role,
    className: cn(
      role === "name"
        ? cn(colFlexible(), "whitespace-normal md:whitespace-nowrap")
        : colFixed(),
      linked && role !== "name" && "whitespace-nowrap",
      ...classes,
    ),
  } as const;
}

/** Roles measured across linked tables to widen shared min-width CSS variables. */
export const LINKED_MEASURE_ROLES: TableColumnRole[] = [
  "name",
  "needed",
  "have",
  "remaining",
];
