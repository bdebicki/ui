import Link from "next/link";
import { variants } from "@/system/lib/variants";

const navLink = variants({
  base: "shrink-0 rounded px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
  variants: {
    appearance: {
      "primary-idle":
        "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
      "secondary-idle":
        "text-zinc-600 group-hover/navgroup:text-zinc-100 group-data-[active]/navgroup:text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100 group-data-[active]/navgroup:hover:bg-primary-700 group-data-[active]/navgroup:hover:text-white",
      active: "bg-primary text-primary-foreground",
    },
  },
  defaults: { appearance: "primary-idle" },
});

type NavLinkProps = {
  href: string;
  active?: boolean;
  /** Standalone link uses primary; links inside a NavGroup use secondary. */
  theme?: "primary" | "secondary";
  children: React.ReactNode;
};

export function NavLink({
  href,
  active = false,
  theme = "primary",
  children,
}: NavLinkProps) {
  const appearance = active
    ? "active"
    : theme === "secondary"
      ? "secondary-idle"
      : "primary-idle";

  return (
    <Link href={href} className={navLink({ appearance })}>
      {children}
    </Link>
  );
}
