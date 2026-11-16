"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { cn } from "../../lib/cn";
import { FIELD_BASE, FIELD_DENSITIES, FIELD_SURFACES, type FieldDensity, type FieldSurface } from "../field";

export type SelectOption = { value: string; label: string };
export type ChoiceProps = Pick<React.ComponentProps<"input">,
  "id" | "name" | "disabled" | "required" | "maxLength" | "autoFocus" | "aria-label" | "aria-labelledby" | "aria-describedby" | "aria-invalid"> & {
  value?: string; options: readonly SelectOption[]; placeholder?: string;
  density?: FieldDensity; surface?: FieldSurface; className?: string;
  onChange?: (value: string) => void; onCommit?: (value: string) => void;
};
export function normalizeChoice(value: string) {
  return value.normalize("NFC").trim().replace(/\s+/g, " ");
}

/** One searchable list for fixed choices and free-form values. */
export function ChoiceField({ value = "", options, placeholder = "Wybierz…", density = "compact", surface = "muted",
  className, onChange, onCommit, creatable = false, name, ...inputProps
}: ChoiceProps & { creatable?: boolean }) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const focused = useRef(false);
  const pendingCommit = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!focused.current) setDraft(value); }, [value]);
  const search = normalizeChoice(query).toLocaleLowerCase("pl");
  const filtered = options.filter(option => option.label.toLocaleLowerCase("pl").includes(search));
  const fresh = normalizeChoice(draft);
  const canCreate = creatable && !!search && !!fresh && !options.some(option => option.label.toLocaleLowerCase("pl") === fresh.toLocaleLowerCase("pl"));
  const entries = [...filtered.map(option => ({ ...option, create: false })),
    ...(canCreate ? [{ value: fresh, label: `Użyj „${fresh}”`, create: true }] : [])];
  const highlighted = active >= 0 && active < entries.length ? active : -1;
  const selectedLabel = options.find(option => option.value === value)?.label ?? "";
  const visible = open && !inputProps.disabled;
  useEffect(() => {
    if (visible && active >= 0) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId, visible]);

  function choose(next: string) {
    setDraft(next); setQuery(""); setActive(-1); pendingCommit.current = false;
    onChange?.(next); onCommit?.(next); setOpen(false);
  }
  function finish() {
    if (creatable && pendingCommit.current) {
      const next = normalizeChoice(draft);
      setDraft(next); onCommit?.(next); pendingCommit.current = false;
    }
    setOpen(false);
  }

  return <div ref={wrapper} className={cn("relative min-w-0", className)}>
    <Popover open={visible} onOpenChange={next => { if (!next) finish(); else setOpen(true); }}>
      <PopoverAnchor asChild><div className="relative">
        <input {...inputProps} ref={input} name={creatable ? name : undefined}
          role="combobox" aria-autocomplete="list" aria-expanded={visible} aria-controls={listId}
          aria-activedescendant={visible && highlighted >= 0 ? `${listId}-${highlighted}` : undefined}
          autoComplete="off" value={creatable ? draft : visible ? query : selectedLabel}
          placeholder={visible && !creatable ? selectedLabel || placeholder : placeholder}
          onFocus={() => { focused.current = true; setQuery(""); setActive(-1); setOpen(true); }}
          onClick={() => { if (!visible) { setQuery(""); setActive(-1); setOpen(true); } }}
          onBlur={event => {
            focused.current = false;
            if (event.relatedTarget instanceof Node && (panel.current?.contains(event.relatedTarget) || wrapper.current?.contains(event.relatedTarget))) return;
            finish();
          }}
          onChange={event => {
            const next = event.target.value;
            setQuery(next); setActive(-1); setOpen(true);
            if (creatable) { setDraft(next); pendingCommit.current = true; onChange?.(next); }
          }}
          onKeyDown={event => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "Escape" && visible) {
              event.preventDefault(); event.stopPropagation();
              setDraft(value); setQuery(""); pendingCommit.current = false; setOpen(false);
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault(); setOpen(true);
              const step = event.key === "ArrowDown" ? 1 : -1;
              setActive(entries.length ? highlighted < 0 ? step > 0 ? 0 : entries.length - 1 : (highlighted + step + entries.length) % entries.length : -1);
            } else if (event.key === "Enter" && visible) {
              event.preventDefault(); event.stopPropagation();
              const option = entries[highlighted < 0 ? 0 : highlighted];
              if (option) choose(option.value);
            }
          }}
          className={cn("w-full disabled:cursor-not-allowed disabled:opacity-50", FIELD_BASE, FIELD_DENSITIES[density], FIELD_SURFACES[surface], "pr-8")} />
        <button type="button" tabIndex={-1} disabled={inputProps.disabled} aria-label="Pokaż opcje"
          onPointerDown={event => event.preventDefault()} onClick={() => {
            const next = !visible; input.current?.focus(); setQuery(""); setActive(-1); setOpen(next);
          }} className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-zinc-400 disabled:opacity-50">
          <span aria-hidden className="text-xs">▾</span>
        </button>
      </div></PopoverAnchor>
      <PopoverContent ref={panel} align="start" sideOffset={2} collisionPadding={8}
        onOpenAutoFocus={event => event.preventDefault()} onCloseAutoFocus={event => event.preventDefault()}
        onEscapeKeyDown={event => {
          event.preventDefault(); event.stopPropagation();
          setDraft(value); setQuery(""); pendingCommit.current = false; setOpen(false);
        }}
        onInteractOutside={event => {
          if (event.target instanceof Node && wrapper.current?.contains(event.target)) event.preventDefault();
        }}
        className="z-[60] w-[var(--radix-popover-trigger-width)] overflow-y-auto overscroll-contain rounded-md border-zinc-200 bg-white p-0 shadow-none data-[state=open]:animate-none data-[state=closed]:animate-none"
        style={{ maxHeight: "min(16rem, var(--radix-popover-content-available-height))", boxShadow: "none" }}>
        <ul id={listId} role="listbox" aria-label={inputProps["aria-label"] || placeholder} className="py-1">
          {entries.map((option, index) => <li key={`${option.create ? "create" : "option"}:${option.value}`}
            id={`${listId}-${index}`} role="option" aria-selected={!option.create && option.value === value} tabIndex={-1}
            onPointerMove={() => setActive(index)} onPointerDown={event => event.preventDefault()}
            onClick={() => choose(option.value)} onKeyDown={event => { if (event.key === "Enter") choose(option.value); }}
            className={cn("flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm break-words text-zinc-900",
              highlighted === index ? "bg-zinc-100" : "hover:bg-zinc-50",
              !option.create && option.value === value && "font-medium text-primary-800")}>
            <span className="min-w-0">{option.label}</span>
            {!option.create && option.value === value && <span aria-hidden className="text-primary-700">✓</span>}
          </li>)}
          {!entries.length && <li role="presentation" className="px-3 py-2 text-sm text-zinc-500">Brak pasujących opcji.</li>}
        </ul>
      </PopoverContent>
    </Popover>
    {!creatable && name && <input type="hidden" name={name} value={value} />}
  </div>;
}
