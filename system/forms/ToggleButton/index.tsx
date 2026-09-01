import { variants } from "../../lib/variants";

const toggleButton = variants({
  base: "flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition",
  variants: {
    state: {
      inactive: "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300",
      primary: "border-primary-600 bg-primary-50 text-primary-800",
      priority: "border-priority-500 bg-priority-50 text-priority-800",
    },
  },
  defaults: { state: "inactive" },
});

type ToggleButtonProps = React.ComponentProps<"button"> & {
  active: boolean;
  tone?: "primary" | "priority";
  icon?: React.ReactNode;
};

export function ToggleButton({
  active,
  tone = "primary",
  icon,
  children,
  className,
  type = "button",
  ...props
}: ToggleButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={toggleButton({
        state: active ? tone : "inactive",
        className,
      })}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
