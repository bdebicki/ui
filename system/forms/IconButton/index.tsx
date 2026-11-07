import { Button } from "@/components/ui/button";
import { forwardRef } from "react";
import { variants } from "../../lib/variants";

const iconButton = variants({
  /** Square, matching the height of a `Button size="sm"` — small taps on mobile. */
  base: "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-sm transition-colors",
  variants: {
    tone: {
      neutral: "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700",
      danger: "text-zinc-400 hover:bg-red-50 hover:text-red-600",
    },
  },
  defaults: { tone: "neutral" },
});

type IconButtonProps = Omit<React.ComponentProps<"button">, "aria-label"> & {
  label: string;
  tone?: "neutral" | "danger";
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, tone, className, type = "button", ...props },
    ref,
  ) {
    return (
      <Button variant="unstyled" size="unstyled"
        ref={ref}
        type={type}
        title={label}
        aria-label={label}
        className={iconButton({ tone, className })}
        {...props}
      />
    );
  },
);
