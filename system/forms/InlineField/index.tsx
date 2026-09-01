import { cn } from "../../lib/cn";

type InlineFieldProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  singleField?: boolean;
};

/** Label placed directly beside its control, for compact single-row forms. */
export function InlineField({ label, children, className, singleField }: InlineFieldProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className={cn(
        "text-zinc-500 whitespace-nowrap",
        singleField ? "text-sm" : "text-xs"
      )}>{label}</span>
      {children}
    </div>
  );
}
