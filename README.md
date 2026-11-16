# Base

Szablon aplikacji Next.js: design system w `system/` plus powłoka (navbar, header, breadcrumby). Nowe projekty forkuje się z tego repo.

## Wzorce produktu

[PATTERNS.md](PATTERNS.md) opisuje, jak składać aplikacje z tych komponentów:
zwarte listy/tabele, dodawanie i edycję w modalu, listy opcji na szerokość pola,
wspólną powłokę, informację o zapisie oraz zachowanie sesji i powrotu z tła.
Rozróżnia gotowe elementy od wzorców, które trzeba dopiero zaimplementować.

Instrukcje agentów (`AGENTS.md`, także przez `CLAUDE.md`) wskazują ten dokument.
Nowy fork dziedziczy zasady;
istniejące aplikacje wymagają jawnego przeniesienia zmian. Repo nie jest jeszcze
wspólnym pakietem automatycznie aktualizującym wszystkie projekty.

## Development

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

## Logowanie

Starter ma wspólny moduł PIN/hasło: `/login`, podpisaną sesję na 30 dni,
wylogowanie w navbarze oraz ochronę stron i API. Lokalny development bez danych
dostępu pomija logowanie; produkcja bez konfiguracji blokuje dostęp.

Skopiuj `.env.example` do `.env.local`, ustaw `APP_PASSWORD` (minimum 4 znaki),
`SESSION_SECRET` (minimum 32 znaki) i unikalne `AUTH_COOKIE_NAME` dla projektu.
Restart serwera stosuje konfigurację. Nie commituj wartości sekretów.

[AUTH.md](AUTH.md) opisuje integrację stron i API, zmianę danych dostępu,
testowanie sesji i ograniczenia modułu. Limit prób jest obecnie lokalny dla procesu;
wdrożenia na wielu instancjach wymagają wspólnego licznika.

## Struktura

- `components/ui/` — komponenty shadcn/ui (Radix), dopasowane do motywu projektu
- `lib/utils.ts` — `cn` oparte na clsx i tailwind-merge
- `system/` — zgodne wstecznie API UI i kompozycje domenowe na komponentach shadcn
- `components/layout/` — navbar i site header (konfiguracja w `NavBar/config.ts`)
- `app/` — strony szkicu (`/`, `/about`, `/settings`)

## Działający przykład i gotowe wzorce

Strona `/` pokazuje zwartą tabelę z wyszukiwaniem, filtrami kategorii/statusu,
małymi miniaturami, szybką zmianą statusu, dodawaniem/edycją w modalu
i potwierdzeniem usuwania. Na telefonie kategoria i status trafiają pod nazwę;
akcje pozostają dostępne. Dane przykładu są zapisywane tylko w bieżącej przeglądarce.

W kodzie aplikacji używaj eksportów `@/system`:

- `Select`: `options` to `{ value, label }[]`; wyszukiwanie nie zmienia wartości
  do chwili wybrania opcji. Brak pasujących opcji nie tworzy nowej wartości.
- `CreatableSelect`: `options` to `string[]`; `onChange` obsługuje pisanie,
  `onCommit` zatwierdzenie na blur lub wybór. Nową wartość można jawnie wybrać z listy.
  Oba pola przyjmują m.in. `id`, `aria-label`, `disabled`, `surface` i `density`.
- `FormDialog`: dostaje `open`, `title`, `description`, `dirty`, `onClose`,
  `onSubmit` i pola jako children. Obsługuje focus, blokadę zapisu, błędy
  i potwierdzenie odrzucenia zmian przy zamykaniu. `onSubmit` rzuca błąd
  przy nieudanym zapisie; sukces zamyka formularz przez `onClose`.
  Sam ustawia focus na pierwszym polu — nie dodawaj `autoFocus` do dzieci.
- `ConfirmDialog`: wspólne potwierdzenie z `onConfirm` (także async), obsługą błędu
  i blokadą na czas operacji. Używaj zamiast natywnego `confirm()`.
- `Table`: istniejąca kompozycja tabeli. Przykład responsywnego użycia wraz
  z edytorem znajduje się w `components/examples/PatternExample.tsx`.

Przykład łączy wspólne komponenty; zapis localStorage nie jest backendem nowej
aplikacji. Podłącz własne API i obsługę konfliktów, zachowując te same wzorce UI.

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
npm test
npx tsc --noEmit
npm run build
```

Testy przeglądarkowe tworzą tymczasową stronę z komponentami i sprawdzają ją na
buildzie produkcyjnym w szerokościach 1440 i 390 px. Sprawdzają także logowanie,
wylogowanie i trwałość cookie po ponownym uruchomieniu przeglądarki.
Sprawdzają też formularze, odrzucanie zmian, błędy zapisu, filtry, CRUD przykładu,
szerokość listy opcji i wybór dotykiem w modalu. Po zakończeniu usuwają stronę
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
