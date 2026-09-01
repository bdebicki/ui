import Link from "next/link";
import { cn } from "../../lib/cn";
import { variants } from "../../lib/variants";

const card = variants({
  base: "border border-zinc-200 bg-white",
  variants: {
    size: {
      md: "rounded-xl p-4",
      lg: "rounded-2xl p-6",
    },
  },
  defaults: { size: "md" },
});

const CARD_LINK = "group transition hover:border-primary-400 hover:shadow-md";

type CardProps = {
  children: React.ReactNode;
  size?: "md" | "lg";
  /** Turns the card into a link; hover affordances are added automatically. */
  href?: string;
  className?: string;
};

export function Card({ children, size, href, className }: CardProps) {
  if (href) {
    return (
      <Link href={href} className={card({ size, className: cn(CARD_LINK, className) })}>
        {children}
      </Link>
    );
  }

  return <div className={card({ size, className })}>{children}</div>;
}
