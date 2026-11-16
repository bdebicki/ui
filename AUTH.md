# Moduł logowania

Wspólna baza dla prywatnych aplikacji jednego właściciela: jeden PIN lub hasło,
bez kont użytkowników, rejestracji i bazy sesji. Moduł jest częścią szablonu;
nie aktualizuje automatycznie raid, listing-manager ani shopping-ideas.

## Konfiguracja

Skopiuj `.env.example` do `.env.local` i ustaw:

- `APP_PASSWORD`: PIN lub hasło, 4–1024 znaki.
- `SESSION_SECRET`: niezależny, losowy sekret, minimum 32 znaki.
  Można go wygenerować przez `openssl rand -hex 32`.
- `AUTH_COOKIE_NAME`: unikalna nazwa aplikacji, np. `shopping-session`.
  Dozwolone są litery ASCII, cyfry, `_` i `-`, do 64 znaków.
  Cookies nie są rozdzielane według portów, więc różne aplikacje na localhost
  również powinny mieć różne nazwy. Domyślna nazwa startera: `base-session`.

Żadna z tych wartości nie ma prefiksu NEXT_PUBLIC. Sekret musi być stabilny
między restartami i wdrożeniami oraz identyczny na wszystkich instancjach aplikacji.
Nie generuj go przy starcie procesu. Używaj osobnych sekretów dla osobnych aplikacji.

Lokalny `npm run dev`, poza Vercel, pomija logowanie tylko wtedy, gdy zarówno
hasło, jak i sekret są puste. Częściowa/błędna konfiguracja blokuje dostęp.
Produkcja (`npm run start`, także lokalnie) i Vercel zawsze wymagają konfiguracji.

## Zachowanie sesji

- HMAC-SHA256 podpisuje wersję i termin ważności tokenu, powiązane z hasłem
  i nazwą cookie. Zmiana hasła, sekretu lub nazwy cookie unieważnia stare tokeny.
- Sesja trwa stałe 30 dni od logowania. Odświeżenie jej nie skraca ani nie odnawia.
  Powrót z tła nie uruchamia ponownego logowania, gdy sesja nadal jest ważna.
- Cookie: HttpOnly, SameSite=Lax, Path=/, Max-Age=30 dni; Secure w produkcji.
  Produkcyjne wdrożenie wymaga HTTPS. Nie zapisujemy danych dostępu w localStorage.
- Wylogowanie usuwa cookie z bieżącej przeglądarki. Moduł jest bezstanowy:
  kopia wcześniej wydanego tokenu pozostaje ważna do wygaśnięcia lub zmiany
  danych dostępu. Natychmiastowe odwoływanie pojedynczych tokenów wymaga magazynu sesji.
- Ekran wspiera hasła i PIN-y; dla PIN-u z samych cyfr pokazuje klawiaturę numeryczną.
- Powrót po logowaniu zachowuje lokalną stronę i query string, np. `/settings?tab=layout`.
  Zewnętrzne adresy i ścieżki logowania/API są odrzucane.

## Podłączanie stron i API

`proxy.ts` chroni strony i API; publiczne są `/login`, `/api/session` oraz
zasoby Next i favicon. Nie dodawaj ogólnego wyjątku na rozszerzenia `.svg`/`.png`:
prywatny endpoint obrazka też wymaga sesji.

Sprawdzaj sesję ponownie przy dostępie do danych. Sam layout ani obecność
przycisku wylogowania nie stanowią ochrony.

W prywatnej stronie serwerowej:

```tsx
import { requirePageSession } from "@/lib/auth/server";

export default async function ItemsPage() {
  await requirePageSession("/items");
  // Dopiero tutaj odczyt prywatnych danych.
  return <div>Lista</div>;
}
```

W prywatnym Route Handlerze:

```ts
import { sessionError } from "@/lib/auth/server";
import { sameOrigin } from "@/lib/auth/session";

export async function POST(request: Request) {
  const error = await sessionError();
  if (error) return error;
  if (!sameOrigin(request)) {
    return Response.json({ error: "Nieprawidłowe źródło żądania." }, { status: 403 });
  }
  // Dopiero tutaj walidacja payloadu i zapis danych.
  return Response.json({ ok: true });
}
```

Server Actions również sprawdzają sesję przed operacją, przez
`requirePageSession()` albo `authentication()`. `sessionError()` zwraca Response
i jest przeznaczone dla Route Handlerów.

Proxy dodatkowo sprawdza Origin przy mutacjach API. Moduł nie jest jeszcze
kontraktem dostępu dla zewnętrznych integracji serwerowych.

## Endpointy

- `POST /api/session`, JSON `{ "password": "…" }`: logowanie i ustawienie cookie.
- `GET /api/session`: stan bieżącej sesji; 401 bez sesji, 503 bez konfiguracji.
- `DELETE /api/session`: wylogowanie przez usunięcie cookie.

POST i DELETE wymagają Origin zgodnego z hostem żądania. Błędy i odpowiedzi
sesji mają Cache-Control: no-store. Prywatne API zwraca JSON 401, zamiast
przekierowania na HTML logowania. Klient aplikacji powinien wtedy zachować szkic
i umożliwić ponowne logowanie; ten starter nie dostarcza jeszcze magazynu szkiców.

## Limit prób i wdrożenie

Limit bazowy: 10 prób w 15 minut, wspólnie dla jednego procesu aplikacji.
Po przekroczeniu zwraca 429 z Retry-After. Restart procesu zeruje licznik.
Przy wielu instancjach lub serverless przenieś licznik z endpointu do wspólnej
bazy/Redis, aby limit obowiązywał między instancjami i restartami. Obecny limiter
nie daje takiej gwarancji. Nie dodajemy zależności od konkretnej bazy do startera.

## Sprawdzenie

- `npm test`: podpis, termin ważności, zmiana danych dostępu, konfiguracja,
  Origin i bezpieczny adres powrotu. Wymaga Node obsługującego strip-types
  (np. 22.12+ lub 24; sam starter dopuszcza też Node 20, ale nie ten runner testów).
- `npm run test:browser`: produkcyjny build, testowe losowe dane dostępu,
  logowanie na telefonie, ochrona stron/API, odświeżenie, nowe karty,
  restart przeglądarki z trwałym profilem, wylogowanie, fałszywe cookie i limit prób,
  a także dotychczasowe testy komponentów. Nie używa prawdziwych danych dostępu.

Test przeglądarkowy nie odtwarza usuwania procesu Safari przez iOS ani konkretnego
wdrożenia innej aplikacji. Po przeniesieniu modułu sprawdź także rzeczywisty
telefon, docelową domenę i produkcyjną konfigurację.
