import { cn } from "../../lib/cn";
import { Badge } from "../Badge";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  count?: number;
  /** Draws attention to an inactive option, e.g. the current day. */
  highlighted?: boolean;
  /** Stays a pill when the remaining options collapse into the select. */
  pinned?: boolean;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /**
   * Above this many options, everything except pinned ones moves to a select.
   * `false` (default) keeps the full pill row, scrolled horizontally.
   */
  collapseAfter?: number | false;
  /** Placeholder on the collapsed select. */
  collapsedLabel?: string;
};

const PILL =
  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition";
/** Shrinks to the pills, but never past the parent — the overflow then scrolls. */
const SCROLLER =
  "w-fit max-w-full overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-100 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const ROW = "flex min-w-max items-center p-1";

function tone(isActive: boolean, highlighted?: boolean) {
  if (isActive) return "bg-white text-zinc-900 shadow-sm";
  return highlighted
    ? "text-priority-800 hover:text-priority-900"
    : "text-zinc-600 hover:text-zinc-900";
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  collapseAfter = false,
  collapsedLabel = "Więcej",
}: SegmentedControlProps<T>) {
  const collapsed = collapseAfter !== false && options.length > collapseAfter;
  const pills = collapsed ? options.filter((option) => option.pinned) : options;
  const listed = collapsed ? options.filter((option) => !option.pinned) : [];
  const listedActive = listed.some((option) => option.value === value);

  return (
    <div className={cn(SCROLLER, className)}>
      <div className={ROW}>
        {pills.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isActive}
              className={cn(PILL, tone(isActive, option.highlighted))}
            >
              <span>{option.label}</span>
              {option.count !== undefined && (
                <Badge size="xs" numeric tone={isActive ? "primary" : "muted"}>
                  {option.count}
                </Badge>
              )}
            </button>
          );
        })}

        {listed.length > 0 && (
          <div className="relative shrink-0">
            <select
              aria-label={collapsedLabel}
              value={listedActive ? value : ""}
              onChange={(event) => onChange(event.target.value as T)}
              className={cn(
                "max-w-52 cursor-pointer appearance-none rounded-lg py-1.5 pl-3 pr-8 text-sm font-medium transition",
                tone(listedActive),
              )}
            >
              <option value="" disabled>
                {`${collapsedLabel} (${listed.length})`}
              </option>
              {listed.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.count === undefined
                    ? option.label
                    : `${option.label} (${option.count})`}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs leading-none text-zinc-400"
            >
              ▾
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
