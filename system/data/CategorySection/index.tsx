import { cn } from "../../lib/cn";

type CategorySectionProps = {
  title: string;
  count: number;
  children: React.ReactNode;
  className?: string;
};

/** A category heading between lists; children can be a table or stacked cards. */
export function CategorySection({ title, count, children, className }: CategorySectionProps) {
  return <section aria-label={title} className={cn("min-w-0 space-y-2", className)}>
    <h2 className="flex items-center gap-2 border-b border-zinc-200 pb-2 text-sm font-semibold text-zinc-900">
      {title}<span className="text-xs font-normal text-zinc-500">{count}</span>
    </h2>
    {children}
  </section>;
}
