# Base

Szablon aplikacji Next.js: design system w `system/` plus powłoka (navbar, header, breadcrumby). Nowe projekty forkuje się z tego repo.

## Development

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

## Struktura

- `system/` — wspólne UI (layout, formularze, tabele, feedback)
- `components/layout/` — navbar i site header (konfiguracja w `NavBar/config.ts`)
- `app/` — strony szkicu (`/`, `/about`, `/settings`)

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4
