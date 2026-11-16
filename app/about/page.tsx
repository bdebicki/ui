import { Card, PageContainer } from "@/system";
import { requirePageSession } from "@/lib/auth/server";

export default async function AboutPage() {
  await requirePageSession("/about");
  return (
    <PageContainer>
      <Card size="lg">
        <p className="text-zinc-700">
          Druga strona szkicu. Navbar (Pages → About) i breadcrumby w headerze
          biorą się ze zmockowanej konfiguracji layoutu.
        </p>
      </Card>
    </PageContainer>
  );
}
