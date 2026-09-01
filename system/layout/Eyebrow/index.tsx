import { variants } from "../../lib/variants";

type EyebrowTone = "muted" | "accent";

const eyebrow = variants({
  base: "text-xs font-medium uppercase tracking-wide",
  variants: {
    tone: {
      muted: "text-zinc-500",
      accent: "text-primary-700",
    },
  },
  defaults: { tone: "muted" },
});

type EyebrowProps = {
  children: React.ReactNode;
  tone?: EyebrowTone;
  as?: "div" | "p" | "span" | "h3";
  className?: string;
};

export function Eyebrow({
  children,
  tone,
  as: Tag = "p",
  className,
}: EyebrowProps) {
  return <Tag className={eyebrow({ tone, className })}>{children}</Tag>;
}
