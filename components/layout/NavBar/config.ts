type NavItem = {
  id: string;
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
};

type NavGroupEntry = {
  type: "group";
  id: string;
  label: string;
  items: NavItem[];
};

type NavLinkEntry = {
  type: "link";
  id: string;
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
};

export type NavEntry = NavGroupEntry | NavLinkEntry;

export const NAV_ENTRIES: NavEntry[] = [
  {
    type: "group",
    id: "pages",
    label: "Pages:",
    items: [
      {
        id: "home",
        label: "Home",
        href: "/",
        isActive: (pathname) => pathname === "/",
      },
      {
        id: "about",
        label: "About",
        href: "/about",
        isActive: (pathname) => pathname.startsWith("/about"),
      },
    ],
  },
  {
    type: "link",
    id: "settings",
    label: "Settings",
    href: "/settings",
    isActive: (pathname) => pathname.startsWith("/settings"),
  },
];
