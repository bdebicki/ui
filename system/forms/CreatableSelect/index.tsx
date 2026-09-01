"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { variants } from "../../lib/variants";
import {
  FIELD_BASE,
  FIELD_DENSITIES,
  FIELD_SURFACES,
  type FieldDensity,
  type FieldSurface,
} from "../field";

const control = variants({
  base: `w-full pr-8 ${FIELD_BASE}`,
  variants: {
    density: FIELD_DENSITIES,
    surface: FIELD_SURFACES,
  },
  defaults: { density: "compact", surface: "muted" },
});

/** Keep in sync with `max-h-48` on the list below. */
const LIST_MAX_HEIGHT = 192;

type CreatableSelectProps = {
  value?: string;
  options: string[];
  placeholder?: string;
  density?: FieldDensity;
  surface?: FieldSurface;
  className?: string;
  /** Per-keystroke updates — omit when value should commit only on blur/select. */
  onChange?: (value: string) => void;
  /** Final value on blur or when picking from the list. */
  onCommit?: (value: string) => void;
};

export function CreatableSelect({
  value = "",
  options,
  placeholder,
  density,
  surface,
  className,
  onChange,
  onCommit,
}: CreatableSelectProps) {
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const isFocused = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFocused.current) {
      setLocalValue(value);
    }
  }, [value]);

  // Fields inside the sticky action bar sit at the bottom of the viewport,
  // where a list opening downwards would land off-screen.
  useEffect(() => {
    if (!open) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const below = window.innerHeight - wrapper.getBoundingClientRect().bottom;
    setDropUp(below < LIST_MAX_HEIGHT);
  }, [open]);

  const query = localValue.trim().toLowerCase();
  const filtered = options.filter((option) =>
    query ? option.toLowerCase().includes(query) : true,
  );

  function commit(next: string) {
    onChange?.(next);
    onCommit?.(next);
  }

  function selectOption(option: string) {
    setLocalValue(option);
    commit(option);
    setOpen(false);
  }

  function handleBlur() {
    isFocused.current = false;
    setOpen(false);
    onCommit?.(localValue.trim());
  }

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <input
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        value={localValue}
        placeholder={placeholder}
        onChange={(event) => {
          const next = event.target.value;
          setLocalValue(next);
          onChange?.(next);
          setOpen(true);
        }}
        onFocus={() => {
          isFocused.current = true;
          setOpen(true);
        }}
        onBlur={handleBlur}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            setLocalValue(value);
          }
        }}
        className={control({ density, surface })}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label="Pokaż opcje"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen((prev) => !prev)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400"
      >
        <span aria-hidden className="text-xs leading-none">
          ▾
        </span>
      </button>

      {open && filtered.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className={cn(
            "absolute z-30 max-h-48 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg",
            dropUp ? "bottom-full mb-1" : "mt-1",
          )}
        >
          {filtered.map((option) => {
            const selected = option === localValue;

            return (
              <li key={option} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-50",
                    selected && "bg-primary-50 text-primary-800",
                  )}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
