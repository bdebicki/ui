import { variants } from "../../lib/variants";

const inlineForm = variants({
  base: "flex flex-wrap rounded-xl border border-zinc-200 bg-white",
  variants: {
    variant: {
      comfortable: "items-start gap-3 px-3 py-3",
      compact: "items-center gap-2 px-3 py-2",
    },
  },
  defaults: { variant: "comfortable" },
});

type InlineFormRootProps = React.ComponentProps<"form"> & {
  variant?: "comfortable" | "compact";
};

export function InlineFormRoot({
  variant,
  className,
  ...props
}: InlineFormRootProps) {
  return <form className={inlineForm({ variant, className })} {...props} />;
}
