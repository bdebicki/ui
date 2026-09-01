import { cn } from "../../lib/cn";
import { variants } from "../../lib/variants";
import { Eyebrow } from "../Eyebrow";

const pageTitle = variants({
  base: "mt-0.5 text-zinc-900",
  variants: {
    size: {
      sm: "text-lg font-semibold",
      lg: "text-2xl font-bold",
    },
  },
  defaults: { size: "sm" },
});

type PageHeaderProps = {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  eyebrowTone?: "muted" | "accent";
  description?: React.ReactNode;
  /** Rendered on the opposite side of the title, e.g. a saving indicator. */
  action?: React.ReactNode;
  size?: "sm" | "lg";
  as?: "h1" | "h2";
  className?: string;
};

export function PageHeader({
  title,
  eyebrow,
  eyebrowTone = "muted",
  description,
  action,
  size,
  as: Title = "h2",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <Eyebrow as="div" tone={eyebrowTone}>
            {eyebrow}
          </Eyebrow>
        )}
        <Title className={pageTitle({ size })}>{title}</Title>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
