import { CenteredMessage } from "../CenteredMessage";

type LoadingStateProps = {
  children?: React.ReactNode;
  className?: string;
};

export function LoadingState({
  children = "Wczytywanie...",
  className,
}: LoadingStateProps) {
  return <CenteredMessage className={className}>{children}</CenteredMessage>;
}
