"use client";

import { useEffect, useRef, useState } from "react";
import { variants } from "../../lib/variants";
import {
  FIELD_BASE,
  FIELD_DENSITIES,
  FIELD_SURFACES,
  type FieldSurface,
} from "../field";

const textarea = variants({
  base: `w-full resize-none ${FIELD_BASE} ${FIELD_DENSITIES.compact}`,
  variants: { surface: FIELD_SURFACES },
  defaults: { surface: "muted" },
});

type TextareaProps = React.ComponentProps<"textarea"> & {
  surface?: FieldSurface;
};

/**
 * Same local-buffer behaviour as `Input` (see there for why): keeps its own
 * text while focused and only resyncs from `value` on blur, so it can't be
 * rewritten mid-edit by a value flowing back from parent/autosave state.
 */
export function Textarea({
  surface,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  rows = 2,
  ...props
}: TextareaProps) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const isFocused = useRef(false);

  useEffect(() => {
    if (!isFocused.current) {
      setLocalValue(value ?? "");
    }
  }, [value]);

  return (
    <textarea
      rows={rows}
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
      className={textarea({ surface, className })}
      {...props}
    />
  );
}
