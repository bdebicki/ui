import { Fragment } from "react";
import { Breadcrumb as ShadcnBreadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
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
    <ShadcnBreadcrumb aria-label="Breadcrumb" className={className}>
      <BreadcrumbList className="gap-x-1.5 gap-y-0 sm:gap-1.5">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {crumb.sep && <BreadcrumbSeparator className={SEP}>{crumb.sep}</BreadcrumbSeparator>}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className={cn(CRUMB, "text-primary-700")}>{crumb.label}</BreadcrumbPage>
                ) : (
                  <span className={cn(CRUMB, "text-zinc-500")}>{crumb.label}</span>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}
