/**
 * Shared look of text-entry controls. Lives at the category level because
 * `Input`, `Textarea` and `CreatableSelect` are separate implementations that
 * must stay visually identical — previously each kept its own copy of these
 * maps and they drifted apart.
 */

export type FieldDensity = "tight" | "compact" | "comfortable" | "withIcon";
export type FieldSurface = "muted" | "white";
export type FieldAlign = "left" | "right";

export const FIELD_BASE =
  "rounded-lg border border-zinc-200 text-zinc-900 outline-none placeholder-zinc-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100";

export const FIELD_DENSITIES: Record<FieldDensity, string> = {
  tight: "px-2 py-1.5 text-sm",
  compact: "px-3 py-1.5 text-sm",
  comfortable: "px-3 py-2 text-base",
  withIcon: "py-1.5 pl-8 pr-3 text-sm",
};

export const FIELD_SURFACES: Record<FieldSurface, string> = {
  muted: "bg-zinc-50",
  white: "bg-white",
};

export const FIELD_ALIGNMENTS: Record<FieldAlign, string> = {
  left: "",
  right: "text-right tabular-nums",
};
