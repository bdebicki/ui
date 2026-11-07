import { TableBody, TableHeader, TableFooter, TableCell, TableHead, TableCaption } from "@/components/ui/table";
import { TableCard } from "./Card";
import { colFixed, colFlexible } from "./columns";
import { TableColGroup } from "./ColGroup";
import { TableHeaderRow } from "./HeaderRow";
import {
  colRole,
  colStripeClass,
  colWidthVar,
  EVOLUTION_DESKTOP_COLUMNS,
  EVOLUTION_MOBILE_COLUMNS,
  LINKED_MEASURE_ROLES,
  MEDALS_COLUMNS,
  type TableColumnRole,
} from "./linked-columns";
import { LinkedTableGroup, useLinkedTable } from "./LinkedTableGroup";
import { TablePrimaryCell } from "./PrimaryCell";
import { TableRoot } from "./Root";
import { TableRow } from "./Row";

import { TableRowGroup } from "./RowGroup";

/**
 * Compound component: `<Table>` is the `<table>` element itself, everything
 * that only makes sense inside one hangs off it as `Table.*`.
 */
export const Table = Object.assign(TableRoot, {
  Card: TableCard,
  Body: TableBody,
  Header: TableHeader,
  Footer: TableFooter,
  Cell: TableCell,
  Head: TableHead,
  Caption: TableCaption,
  ColGroup: TableColGroup,
  HeaderRow: TableHeaderRow,
  Row: TableRow,
  RowGroup: TableRowGroup,
  PrimaryCell: TablePrimaryCell,
  colFlexible,
  colFixed,
  colRole,
  colStripeClass,
  colWidthVar,
});

export {
  EVOLUTION_DESKTOP_COLUMNS,
  EVOLUTION_MOBILE_COLUMNS,
  LINKED_MEASURE_ROLES,
  LinkedTableGroup,
  MEDALS_COLUMNS,
  useLinkedTable,
  type TableColumnRole,
};
