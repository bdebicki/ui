import { cn } from "../../lib/cn";
import { variants } from "../../lib/variants";

const button = variants({
  base: "rounded-lg text-sm transition disabled:cursor-not-allowed disabled:opacity-40",
  variants: {
    variant: {
      primary: "bg-primary-500 font-medium text-white hover:bg-primary-600",
      secondary: "border border-zinc-200 text-zinc-600 hover:bg-zinc-50",
      ghost: "text-zinc-400 hover:text-zinc-700",
    },
    size: {
      sm: "px-3 py-1.5",
      md: "px-4 py-2.5",
    },
  },
  defaults: { variant: "primary", size: "sm" },
});

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  fullWidth?: boolean;
};

export function Button({
  variant,
  size,
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={button({
        variant,
        size,
        className: cn(fullWidth && "w-full", className),
      })}
      {...props}
    />
  );
}
