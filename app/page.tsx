import { PatternExample } from "@/components/examples/PatternExample";
import { requirePageSession } from "@/lib/auth/server";

export default async function HomePage() {
  await requirePageSession();
  return <PatternExample />;
}
