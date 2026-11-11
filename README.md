# Base

Szablon aplikacji Next.js: design system w `system/` plus powłoka (navbar, header, breadcrumby). Nowe projekty forkuje się z tego repo.

## Development

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

## Struktura

- `components/ui/` — komponenty shadcn/ui (Radix), dopasowane do motywu projektu
- `lib/utils.ts` — `cn` oparte na clsx i tailwind-merge
- `system/` — zgodne wstecznie API UI i kompozycje domenowe na komponentach shadcn
- `components/layout/` — navbar i site header (konfiguracja w `NavBar/config.ts`)
- `app/` — strony szkicu (`/`, `/about`, `/settings`)

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4

## shadcn/ui

Konfiguracja CLI jest w `components.json`. Dodawanie kolejnych komponentów:

```bash
npx shadcn add <komponent>
```

Komponenty są kodem projektu, a ich style zostały dopasowane do istniejącego UI:
Geist, paleta primary/priority/platinum, obramowania zinc i dotychczasowe odstępy.
Tokeny shadcn znajdują się w `app/globals.css`. Nie nadpisuj lokalnych plików
`components/ui/` flagą `--overwrite` bez przeniesienia tych dostosowań.

Importy z `@/system` nadal działają. Adaptery zachowują m.in. `fullWidth`,
warianty gęstości pól, bufor tekstu podczas edycji, ograniczenia `NumberInput`,
`onCommit` w `CreatableSelect` i złożone tabele z przyklejonymi kolumnami.
Layout aplikacji oraz kompozycje bez odpowiednika shadcn pozostają w `system/`.

Weryfikacja migracji (wymaga przeglądarki `npx playwright install chromium`):

```bash
npm run test:browser
npx tsc --noEmit
npm run build
```

Testy przeglądarkowe tworzą tymczasową stronę z komponentami i sprawdzają ją na
buildzie produkcyjnym w szerokościach 1280 i 390 px. Po zakończeniu usuwają stronę
testową i ponownie budują aplikację, aby wynik produkcyjny zawierał tylko jej strony.

## Wspólne proporcje UI

Powłoka: Container max-w-6xl (1152 px), padding boczny 16/24 px;
NavBar ma minimum 40 px i osobny wewnętrzny obszar przewijania.
Opcjonalne `brand`, `action` i `entries` pozwalają użyć tej samej powłoki
w aplikacji z jedną stroną. Akcje w pasku powinny mieścić się w 24 px wysokości.
Nagłówek strony: PageHeader lg (24 px/bold) w Container z py-4.
Button sm (32 px) służy do toolbarów i kart, md (40 px) do głównego zapisu formularza.
Przycisk primary korzysta z semantycznego tokenu --primary (odcień primary-700),
z białym tekstem; paleta primary-50…900 zachowuje dotychczasowe wartości.
Card zarządza paddingiem; CardHeader/Content/Footer nie dodają bocznego paddingu.
SegmentedControl zachowuje neutralne zaznaczenie: biała opcja na szarej otoczce.
