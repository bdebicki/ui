"use client";

import { usePathname } from "next/navigation";
import { Container } from "@/system";
import { NAV_ENTRIES, type NavEntry } from "./config";
import { NavGroup } from "./NavGroup";
import { NavLink } from "./NavLink";
import { NavSeparator } from "./NavSeparator";

type NavBarProps = {
  brand?: React.ReactNode;
  action?: React.ReactNode;
  entries?: NavEntry[];
};

/** Compact shell. The inner scroller cannot widen the shared Container. */
export function NavBar({ brand, action, entries = NAV_ENTRIES }: NavBarProps) {
  const pathname = usePathname();
  return (
    <nav aria-label="Nawigacja aplikacji" className="bg-zinc-900 text-zinc-100">
      <Container className="flex min-h-10 items-center gap-3 py-2">
        {brand && <div className="shrink-0 text-xs font-semibold">{brand}</div>}
        <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-0.5">
            {entries.map((entry, index) => (
              <span key={entry.id} className="contents">
                {index > 0 && <NavSeparator />}
                {entry.type === "group" ? (
                  <NavGroup label={entry.label} active={entry.items.some((item) => item.isActive(pathname))}
                    items={entry.items.map((item) => ({ href: item.href, label: item.label, active: item.isActive(pathname) }))} />
                ) : (
                  <NavLink href={entry.href} active={entry.isActive(pathname)}>{entry.label}</NavLink>
                )}
              </span>
            ))}
          </div>
        </div>
        {action && <div className="flex shrink-0 items-center">{action}</div>}
      </Container>
    </nav>
  );
}
