"use client";

import { TableRow as ShadcnTableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/cn";

type ClickableRowProps = Omit<React.ComponentProps<"tr">, "onClick"> & {
  href: string;
};

/** A table row that navigates like a link, including keyboard support. */
export function ClickableRow({
  href,
  className,
  children,
  ...props
}: ClickableRowProps) {
  const router = useRouter();

  return (
    <ShadcnTableRow
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        router.push(href);
      }}
      className={cn("border-0 last:border-0 cursor-pointer hover:bg-zinc-50", className)}
      {...props}
    >
      {children}
    </ShadcnTableRow>
  );
}
