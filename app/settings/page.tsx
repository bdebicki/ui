import { SetSiteHeader } from "@/components/layout";
import { Card, PageContainer } from "@/system";

const LAYOUT_BITS = [
  {
    name: "Navbar",
    detail: "components/layout/NavBar — grupy i linki z config.ts",
  },
  {
    name: "Header",
    detail: "components/layout/SiteHeader — tytuł strony + opcjonalny opis",
  },
  {
    name: "Breadcrumbs",
    detail: "APP / kategoria | segment, mapowane po pathname",
  },
];

export default function SettingsPage() {
  return (
    <PageContainer>
      <SetSiteHeader
        title="Layout"
        description="Navbar, header i breadcrumby są już podpięte w root layoucie."
      />
      <Card size="lg">
        <p className="text-sm font-medium text-zinc-900">Ustawienia layoutu</p>
        <p className="mt-1 text-sm text-zinc-500">
          Szkic bez prawdziwego theme-switchera. Chrome (navbar, header,
          breadcrumby) jest już podpięty w root layoucie.
        </p>
        <ul className="mt-4 divide-y divide-zinc-100">
          {LAYOUT_BITS.map((bit) => (
            <li key={bit.name} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
              <span className="text-sm font-medium text-zinc-900">{bit.name}</span>
              <span className="text-sm text-zinc-500">{bit.detail}</span>
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
}
