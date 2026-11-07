"use client";

import { Input as ShadcnInput } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { variants } from "../../lib/variants";
import {
  FIELD_ALIGNMENTS,
  FIELD_BASE,
  FIELD_DENSITIES,
  FIELD_SURFACES,
  type FieldAlign,
  type FieldDensity,
  type FieldSurface,
} from "../field";

const input = variants({
  base: FIELD_BASE,
  variants: {
    density: FIELD_DENSITIES,
    surface: FIELD_SURFACES,
    align: FIELD_ALIGNMENTS,
  },
  defaults: { density: "compact", surface: "muted", align: "left" },
});

export type InputProps = React.ComponentProps<"input"> & {
  density?: FieldDensity;
  surface?: FieldSurface;
  align?: FieldAlign;
};

/**
 * Keeps its own text buffer while focused, so it never gets rewritten
 * mid-keystroke by a value flowing back from parent state (debounced
 * autosave round-trips, background refreshes, numeric clamping, etc).
 * The buffer only re-syncs from `value` on mount, on blur, and on external
 * changes while unfocused.
 */
export function Input({
  density,
  surface,
  align,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const isFocused = useRef(false);

  useEffect(() => {
    if (!isFocused.current) {
      setLocalValue(value ?? "");
    }
  }, [value]);

  return (
    <ShadcnInput
      value={localValue}
      onChange={(event) => {
        setLocalValue(event.target.value);
        onChange?.(event);
      }}
      onFocus={(event) => {
        isFocused.current = true;
        onFocus?.(event);
      }}
      onBlur={(event) => {
        isFocused.current = false;
        setLocalValue(value ?? "");
        onBlur?.(event);
      }}
      className={input({ density, surface, align, className })}
      {...props}
    />
  );
}
