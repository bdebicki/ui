import { cn, type ClassValue } from "../../lib/cn";

/** Flexible column — grows to fill remaining table width. */
export function colFlexible(...classes: ClassValue[]) {
  return cn("min-w-0 w-full", ...classes);
}

/** Fixed column — shrinks to fit content (`fit-content`). */
export function colFixed(...classes: ClassValue[]) {
  return cn("w-0 whitespace-nowrap", ...classes);
}
