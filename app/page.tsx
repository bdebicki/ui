import { Card, PageContainer } from "@/system";

export default function HomePage() {
  return (
    <PageContainer>
      <Card size="lg">
        <p className="text-zinc-700">Hello World.</p>
        <p className="mt-2 text-sm text-zinc-500">
          To jest bazowy starter. Nowe projekty forkuje się z tego repo —
          system UI i layout zostają, treść dokładasz we własnym forku.
        </p>
      </Card>
    </PageContainer>
  );
}
