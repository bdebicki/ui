"use client";

import { useEffect, useRef, useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { variants } from "../../lib/variants";
import { FIELD_BASE, FIELD_DENSITIES, FIELD_SURFACES, type FieldDensity, type FieldSurface } from "../field";

const control = variants({
  base: `w-full ${FIELD_BASE}`,
  variants: {
    density: FIELD_DENSITIES,
    surface: FIELD_SURFACES,
  },
  defaults: { density: "compact", surface: "muted" },
});

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
  value = "", options, placeholder, density, surface, className, onChange, onCommit,
}: CreatableSelectProps) {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const isFocused = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused.current) setLocalValue(value);
  }, [value]);

  const query = localValue.trim().toLowerCase();
  const filtered = options.filter((option) => !query || option.toLowerCase().includes(query));

  function selectOption(option: string) {
    setLocalValue(option);
    onChange?.(option);
    onCommit?.(option);
    setOpen(false);
  }

  return (
    <Command shouldFilter={false} className={cn("relative h-auto overflow-visible rounded-none bg-transparent", className)}>
      <Popover open={open && filtered.length > 0} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <CommandInput
              bare
              ref={inputRef}
              aria-expanded={open && filtered.length > 0}
              value={localValue}
              placeholder={placeholder}
              onValueChange={(next) => {
                setLocalValue(next);
                onChange?.(next);
                setOpen(true);
              }}
              onFocus={() => { isFocused.current = true; setOpen(true); }}
              onBlur={() => {
                isFocused.current = false;
                setOpen(false);
                onCommit?.(localValue.trim());
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setOpen(false);
                  setLocalValue(value);
                }
              }}
              className={control({ density, surface, className: "pr-8" })}
            />
            <Button
              variant="unstyled" size="unstyled" tabIndex={-1} aria-label="Pokaż opcje"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (!isFocused.current) inputRef.current?.focus();
                setOpen(!open);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              <span aria-hidden className="text-xs leading-none">▾</span>
            </Button>
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start" sideOffset={4}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            if (event.target instanceof Node && inputRef.current?.parentElement?.contains(event.target)) event.preventDefault();
          }}
          className="z-30 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg border-zinc-200 bg-white p-0 shadow-lg"
        >
          <CommandList className="max-h-48 py-1">
            {filtered.map((option) => (
              <CommandItem
                key={option} value={option} onSelect={() => selectOption(option)}
                onMouseDown={(event) => event.preventDefault()}
                className={cn(
                  "w-full cursor-pointer rounded-none px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-50 data-[selected=true]:bg-primary-50 data-[selected=true]:text-primary-800",
                  option === localValue && "bg-primary-50 text-primary-800",
                )}
              >{option}</CommandItem>
            ))}
          </CommandList>
        </PopoverContent>
      </Popover>
    </Command>
  );
}
