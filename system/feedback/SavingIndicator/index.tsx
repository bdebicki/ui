import { cn } from "../../lib/cn";

type SavingIndicatorProps = {
  saving: boolean;
  className?: string;
};

export function SavingIndicator({ saving, className }: SavingIndicatorProps) {
  return (
    <span
      className={cn(
        "shrink-0 text-xs text-zinc-400",
        !saving && "invisible",
        className,
      )}
      aria-hidden={!saving}
      aria-live="polite"
    >
      Zapisywanie…
    </span>
  );
}
