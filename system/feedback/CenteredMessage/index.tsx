import { cn } from "../../lib/cn";

type CenteredMessageProps = {
  children: React.ReactNode;
  className?: string;
};

/** Fills the remaining page height with a single centered line of text. */
export function CenteredMessage({ children, className }: CenteredMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center py-20 text-zinc-500",
        className,
      )}
    >
      {children}
    </div>
  );
}
