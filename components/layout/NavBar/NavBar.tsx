"use client";

import { usePathname } from "next/navigation";
import { Container } from "@/system";
import { NAV_ENTRIES, type NavEntry } from "./config";
import { NavGroup } from "./NavGroup";
import { NavLink } from "./NavLink";
import { NavSeparator } from "./NavSeparator";

function resolveEntries(): NavEntry[] {
  return NAV_ENTRIES;
}

export function NavBar() {
  const pathname = usePathname();
  const entries = resolveEntries();

  return (
    <nav className="bg-zinc-900 text-zinc-100">
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Container className="flex w-max min-w-full flex-nowrap items-center gap-0.5 py-2">
          {entries.map((entry, index) => (
            <span key={entry.id} className="contents">
              {index > 0 && <NavSeparator />}
              {entry.type === "group" ? (
                <NavGroup
                  label={entry.label}
                  active={entry.items.some((item) => item.isActive(pathname))}
                  items={entry.items.map((item) => ({
                    href: item.href,
                    label: item.label,
                    active: item.isActive(pathname),
                  }))}
                />
              ) : (
                <NavLink href={entry.href} active={entry.isActive(pathname)}>
                  {entry.label}
                </NavLink>
              )}
            </span>
          ))}
        </Container>
      </div>
    </nav>
  );
}
