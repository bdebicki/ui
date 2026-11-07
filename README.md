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
