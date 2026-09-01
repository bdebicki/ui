import { cn } from "../../lib/cn";

/** root / category | segment / nested-segment */
export type BreadcrumbTrail = {
  root: string;
  category?: string;
  segments?: string[];
};

type BreadcrumbProps = {
  trail: BreadcrumbTrail;
  className?: string;
};

const CRUMB = "text-xs font-medium uppercase tracking-wide";
const SEP = "text-xs font-medium text-zinc-400";

function Crumb({ label, active }: { label: string; active?: boolean }) {
  return (
    <span className={cn(CRUMB, active ? "text-primary-700" : "text-zinc-500")}>
      {label}
    </span>
  );
}

function buildCrumbs(trail: BreadcrumbTrail) {
  const { root, category, segments = [] } = trail;
  const crumbs: { label: string; sep: "/" | "|" | null }[] = [
    { label: root, sep: null },
  ];

  if (category) {
    crumbs.push({ label: category, sep: "/" });
  }

  for (let i = 0; i < segments.length; i++) {
    crumbs.push({ label: segments[i], sep: i === 0 ? "|" : "/" });
  }

  return crumbs;
}

export function Breadcrumb({ trail, className }: BreadcrumbProps) {
  const crumbs = buildCrumbs(trail);

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li
              key={`${crumb.label}-${index}`}
              className="flex items-center gap-x-1.5"
            >
              {crumb.sep && (
                <span aria-hidden className={SEP}>
                  {crumb.sep}
                </span>
              )}
              <Crumb label={crumb.label} active={isLast} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
