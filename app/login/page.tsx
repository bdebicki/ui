import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { authentication } from "@/lib/auth/server";
import { safeReturnTo } from "@/lib/auth/session";

export const metadata = { title: "Logowanie" };

export default async function LoginPage({ searchParams }: {
  searchParams: Promise<{ from?: string | string[] }>;
}) {
  const returnTo = safeReturnTo((await searchParams).from);
  const { config, authenticated } = await authentication();
  if (authenticated) redirect(returnTo);
  return <LoginForm returnTo={returnTo} configured={config.mode === "enabled"}
    numeric={config.mode === "enabled" && /^\d+$/.test(config.password)} />;
}
