import { cn } from "../../lib/cn";
import { Input, type InputProps } from "../Input";

type SearchInputProps = Omit<InputProps, "type" | "density" | "surface"> & {
  wrapperClassName?: string;
};

export function SearchInput({
  className,
  wrapperClassName,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <svg
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <Input
        type="search"
        density="withIcon"
        surface="white"
        className={cn("w-full", className)}
        {...props}
      />
    </div>
  );
}
