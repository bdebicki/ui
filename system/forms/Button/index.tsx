import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  fullWidth?: boolean;
};

export function Button({ fullWidth = false, className, ...props }: ButtonProps) {
  return <ShadcnButton className={cn(fullWidth && "w-full", className)} {...props} />;
}
