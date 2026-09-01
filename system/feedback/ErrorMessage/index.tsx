import { variants } from "../../lib/variants";

const errorMessage = variants({
  variants: {
    variant: {
      banner: "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700",
      inline: "text-sm text-red-600",
    },
  },
  defaults: { variant: "banner" },
});

type ErrorMessageProps = {
  children?: React.ReactNode;
  variant?: "banner" | "inline";
  className?: string;
};

export function ErrorMessage({
  children,
  variant,
  className,
}: ErrorMessageProps) {
  if (!children) return null;

  return (
    <p role="alert" className={errorMessage({ variant, className })}>
      {children}
    </p>
  );
}
