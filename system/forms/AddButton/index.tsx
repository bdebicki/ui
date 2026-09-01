import { cn } from "../../lib/cn";

type AddButtonProps = React.ComponentProps<"button">;

export function AddButton({
  children,
  className,
  type = "button",
  ...props
}: AddButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-zinc-300 bg-white py-2 text-sm text-zinc-500 transition-colors hover:border-primary-400 hover:text-primary-600",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="text-base leading-none">
        +
      </span>
      {children}
    </button>
  );
}
