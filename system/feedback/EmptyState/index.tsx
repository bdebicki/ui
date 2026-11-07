import { Empty } from "@/components/ui/empty";
import { variants } from "../../lib/variants";

const emptyState = variants({
  base: "rounded-xl border text-center text-sm",
  variants: {
    variant: {
      solid: "border-zinc-200 bg-white px-4 py-6 text-zinc-500",
      dashed: "border-dashed border-zinc-200 bg-transparent px-0 py-8 text-zinc-400",
    },
  },
  defaults: { variant: "solid" },
});

type EmptyStateProps = {
  children: React.ReactNode;
  variant?: "solid" | "dashed";
  className?: string;
};

export function EmptyState({ children, variant, className }: EmptyStateProps) {
  return <Empty className={emptyState({ variant, className })}>{children}</Empty>;
}
