import { cn } from "@/system";
import { NavLink } from "./NavLink";

type NavGroupItem = {
  href: string;
  label: string;
  active: boolean;
};

type NavGroupProps = {
  label: string;
  active: boolean;
  items: NavGroupItem[];
};

export function NavGroup({ label, active, items }: NavGroupProps) {
  return (
    <span
      className={cn(
        "group/navgroup flex shrink-0 items-center rounded",
        active && "bg-primary-900",
      )}
      data-active={active ? "" : undefined}
    >
      <span
        className={cn(
          "shrink-0 pl-3 pr-1 text-xs tracking-wider whitespace-nowrap text-zinc-400 transition-colors",
          "group-hover/navgroup:text-zinc-100",
          "group-data-[active]/navgroup:text-white",
        )}
      >
        {label}
      </span>
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          active={item.active}
          theme="secondary"
        >
          {item.label}
        </NavLink>
      ))}
    </span>
  );
}
