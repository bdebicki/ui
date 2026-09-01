import { variants } from "../../lib/variants";
import { Container } from "../Container";

const pageContainer = variants({
  variants: {
    variant: {
      stack: "flex flex-col gap-4 py-4 sm:py-6",
      plain: "py-6",
    },
  },
  defaults: { variant: "stack" },
});

type PageContainerProps = {
  children: React.ReactNode;
  variant?: "stack" | "plain";
  className?: string;
};

export function PageContainer({
  children,
  variant,
  className,
}: PageContainerProps) {
  return (
    <Container className={pageContainer({ variant, className })}>
      {children}
    </Container>
  );
}
