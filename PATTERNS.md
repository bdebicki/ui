# Wzorce budowania aplikacji

Ten plik opisuje wspólne zasady interfejsu aplikacji budowanych z tego szablonu.
`ui` jest źródłem komponentów i wzorców; projekty pochodne dodają domenę, dane
i konfigurację nawigacji. Nowy ekran zaczynaj od tych wzorców.

Zasady dotyczą nowych ekranów i zmienianych przepływów. Nie oznaczają zgody
na przebudowę całej istniejącej aplikacji przy drobnym zadaniu.

## Co już istnieje, a co trzeba zbudować

- **Dostępne:** powłoka NavBar/SiteHeader, Container/PageContainer/PageHeader,
  złożone Table, pola i feedback w `system/`, Dialog i prymitywy w `components/ui/`,
  moduł logowania i sesji opisany w [AUTH.md](AUTH.md).
- **Dostępne wzorce:** FormDialog (zapis, błędy, odrzucenie zmian), ConfirmDialog,
  Select (wybór istniejącej wartości), CreatableSelect (także nowa wartość).
  Oba pola korzystają z jednej listy ChoiceField. Strona `/` pokazuje cały przepływ
  na zwartej tabeli; przykładowe dane zapisują się lokalnie w przeglądarce.
- **Do integracji w aplikacji:** reakcja formularza na 401 i zachowanie szkicu,
  odświeżanie po powrocie z tła i konflikty zapisu.

Dokument jest kierunkiem rozwoju, nie deklaracją, że wszystkie aplikacje już
spełniają te zasady. Nie kopiuj rozwiązania z aplikacji tylko dlatego, że istnieje.

## 1. Lista danych: zwarte wiersze jako domyślny widok

Listy zakupów, ogłoszeń, planów i postępów pokazuj jako zwartą listę lub tabelę.
Użytkownik ma szybko skanować wiele wpisów i porównywać ich wartości.

- Gdy dane mają porównywalne kolumny, używaj semantycznej tabeli i `Table` z `@/system`.
- Dla prostych wpisów dopuszczalna jest semantyczna lista ze wspólnym układem wiersza.
  Nie buduj drugiego wyglądu pojedynczego rekordu jako dużej karty.
- Kolejność informacji: nazwa, istotne wartości/kategoria, status, akcje.
  Kolumny wynikają z domeny — nie muszą być identyczne w każdej aplikacji.
- Obrazek jest małą opcjonalną miniaturą. Duży obrazek i pełny opis trafiają
  do szczegółów lub formularza w modalu, nie dominują w liście.
- Wspieraj grupowanie, np. po kategorii, bez zmiany każdego wpisu w osobny panel.
- Nie dodawaj domyślnie siatki kart ani przełącznika karty/tabela.
  Galeria jest osobnym wzorcem dla zadania polegającego na oglądaniu obrazów;
  wymaga wyraźnej potrzeby, nie samej obecności zdjęć w rekordach.

Na telefonie zachowaj zwarty widok: nazwa, status i najważniejsza akcja zostają
widoczne, dane drugorzędne mogą przejść do drugiej linii lub szczegółów.
Złożona tabela liczników może przewijać się poziomo we własnym obszarze;
cała strona nie może rozszerzać się poza ekran. Zachowaj dostęp do nazwy rekordu.
Nie stosuj ukrywania kolumn, które usuwa jedyną możliwość wykonania operacji.

Punkt startu: `system/data/Table/`, `Table.Card`, `Table.PrimaryCell`.
`Table.Card` to wspólna obudowa tabeli, nie zalecenie robienia kart rekordów.

## 2. Dodawanie i pełna edycja: modal

- Jedna główna akcja „Dodaj …” w nagłówku strony otwiera modal.
  Pusty stan może prowadzić do tej samej akcji.
- Dodawanie i pełna edycja używają tej samej kompozycji formularza.
  Wymagaj wyłącznie danych koniecznych do utworzenia rekordu.
- W modalu: jednoznaczny tytuł, etykiety pól, autofocus pierwszego pola,
  Zapisz i Anuluj, błąd przy formularzu oraz stan zapisywania.
- Zachowaj pułapkę focus i powrót focus do przycisku otwierającego.
  Modal przewija zawartość i mieści się w dostępnym obszarze telefonu.
- Nie zamykaj formularza po błędzie. Zachowaj wpisane wartości.
  Podczas zapisu blokuj ponowne wysłanie i zamknięcie.
- Escape, klik poza modalem, przycisk zamknięcia i Anuluj muszą stosować
  tę samą politykę: niezapisane zmiany wymagają potwierdzenia odrzucenia.
- Szybkie operacje pozostają w wierszu: licznik, slot rajdu, kupione, status.
  Nie otwieraj pełnego formularza dla każdej pojedynczej operacji.

Punkt startu: `FormDialog` z `@/system`, oparty o `components/ui/dialog.tsx`.
Przekaż pola, `dirty`, `onClose` i `onSubmit`; odrzucona obietnica lub wyjątek
z `onSubmit` pokazuje błąd i zachowuje formularz. Udany zapis zamyka modal.
Trzymaj edytowany rekord stabilnie i nadaj formularzowi nowy `key` przy zmianie rekordu.
InlineForm pozostaje dostępny dla celowych operacji kontekstowych;
nie jest domyślnym sposobem dodawania pełnego rekordu pod tabelą.

## 3. Wybór wartości: normalna lista na szerokość pola

- Używaj własnej listy zakotwiczonej do pola, o szerokości pola.
  Prostokątny panel z delikatnym obramowaniem i minimalnym odstępem;
  bez grotu, komiksowego dymka, dużego cienia i dekoracyjnego powiększania.
- Lista otwiera się pod polem, a przy braku miejsca nad nim. Ma ograniczoną
  wysokość i scroll. Nie może być obcinana przez modal, tabelę ani dolny pasek.
- Dwa tryby tego samego wzorca: wybór istniejącej wartości (filtr/status)
  i wybór lub wpisanie własnej wartości (np. kategoria w formularzu).
  Nie twórz osobnych wizualnych implementacji dla tych trybów.
- Obsłuż wyszukiwanie, wybraną opcję, strzałki, Enter, Escape, dotyk,
  focus, etykietę oraz semantykę combobox/listbox zgodnie z użytym prymitywem.
- Przy braku dopasowania pokaż czytelny komunikat; w trybie własnej wartości
  jasno pokaż możliwość użycia wpisanej nazwy.
- W tych przepływach nie używaj HTML `select` ani `datalist`.
  Istniejący NativeSelect nie jest domyślnym wzorcem produktu.
  Chevron w polu może wskazywać rozwijanie; zakaz grotu dotyczy panelu listy.

Punkt startu: `Select` i `CreatableSelect` z `@/system`, współdzielące
`system/forms/ChoiceField/` i Radix Popover jako mechanizm pozycjonowania.
Popover nie wymaga wyglądu dymka. Zwijane opcje SegmentedControl również używają Select.
Najpierw dopracuj wspólny komponent, potem podłącz go w rzeczywistych formularzach
i filtrach. Zmiana nieużywanego adaptera nie naprawia natywnego datalist w aplikacji.

Nazwy kategorii przycinaj, scalaj odstępy, normalizuj Unicode i porównuj bez
rozróżniania wielkości liter. Konkretne limity i katalog kategorii należą do domeny;
aplikacje nie muszą współdzielić kategorii.

## 4. Powłoka, proporcje i informacja zwrotna

- Używaj wspólnego NavBar, SiteHeader i PageContainer zamiast własnej kopii layoutu.
  Nazwa aplikacji, linki i kolumny są konfigurowalne.
- Container: max-w-6xl, boczne odstępy 16/24 px. Nagłówek strony:
  PageHeader `as="h1"`, `size="lg"`, jeden główny tytuł i akcja dodawania.
- Przyciski: `sm` w toolbarze i wierszu, `md` dla głównego zapisu formularza.
  Używaj tokenów primary, priority, platinum i zinc; nie dobieraj osobnej palety w aplikacji.
- Filtry i wyszukiwanie nad listą; widoczna liczba wyników. Odróżniaj pustą
  listę od braku wyników filtrowania i daj możliwość wyczyszczenia filtrów.
- Pokazuj stan operacji tam, gdzie została uruchomiona. Sukces po odpowiedzi
  serwera; przy optymistycznej zmianie zapewnij odtworzenie stanu po błędzie.
- Błędy mają konkretny komunikat i możliwość ponowienia; nie kasują formularza.
  Konflikt zapisu nie może po cichu nadpisać nowszych danych ani lokalnego szkicu.
- Potwierdzenia usunięcia i odrzucenia zmian używają Dialog, nie `window.confirm()`.
  Akcje ikonowe mają dostępne nazwy; stan nie może być przekazywany samym kolorem.
- Teksty interfejsu pisz po polsku, z jednolitym nazewnictwem w obrębie aplikacji.

## 5. Sesja i powrót z tła

Moduł sesji jest w `lib/auth/`, ekran w `components/auth/`, a konfiguracja
i ograniczenia w [AUTH.md](AUTH.md). Zachowanie formularzy i pobierania danych
po powrocie z tła pozostaje odpowiedzialnością konkretnej aplikacji.

- Logowanie ma przetrwać odświeżenie, przełączenie aplikacji i powrót z tła
  w okresie ważności sesji. Obecny punkt odniesienia to 30 dni.
  Odnawianie przy aktywności wymaga osobnej decyzji i implementacji.
- Używaj podpisanej sesji z serwerową kontrolą ważności i trwałym cookie HttpOnly.
  Nie przenoś mechanizmu `raid-auth=1` jako wzorca uwierzytelniania.
- Wylogowanie usuwa cookie urządzenia, a zmiana danych dostępu unieważnia podpisy sesji.
  Wspólne zachowanie nie oznacza współdzielenia hasła/cookie między aplikacjami.
- Obsługuj 401 wspólnie dla pobierania i zapisywania; nie przedstawiaj wygasłej
  sesji jako zwykłego błędu walidacji. Zachowaj szkic formularza na czas ponownego
  logowania, bez zapisywania haseł ani PIN-ów w pamięci klienta.
- Odświeżaj dane po rzeczywistym powrocie z tła (`visibilitychange`),
  z ochroną trwającego zapisu i niezapisanej edycji. Nie przebudowuj widoku
  przy każdym focus. Obsłuż odświeżenie odłożone na czas po edycji.
- Powrót do karty nie resetuje filtrów, scrolla ani otwartego formularza.
  Pełne odtworzenie po usunięciu procesu przez system wymaga osobnej obsługi szkicu.

## 6. Jak rozwijać wspólny wzorzec

1. Sprawdź istniejący komponent i ten dokument; używaj publicznego API `system/`
   lub istniejącego prymitywu `components/ui/`. Nie twórz lokalnego odpowiednika.
2. Zmianę wspólnego zachowania wprowadź najpierw w ui wraz z demonstracją
   w `tests/fixtures/ui.tsx` i adekwatną weryfikacją przeglądarkową.
3. Przenieś ją do aplikacji bez nadpisywania konfiguracji domeny, danych ani routingu.
   Ui jest obecnie szablonem kopiowanym do repo, nie zainstalowanym wspólnym pakietem;
   zmiana tutaj nie aktualizuje automatycznie istniejących projektów.
4. Sprawdź użycie w prawdziwym przepływie aplikacji. Weryfikuj desktop i telefon:
   listę, modal, klawiaturę, menu przy krawędzi, błędy zapisu i powrót z tła.
   Przy zmianie auth sprawdź też odświeżenie i trwałość sesji w buildzie produkcyjnym.
5. Uzupełnij dokument, jeśli zmieniasz wzorzec. Jawne wymaganie użytkownika
   ma pierwszeństwo; uzgodniony wyjątek opisz przy danym ekranie.

Nie ujednolicamy na siłę baz danych, integracji ani operacji domenowych.
Ujednolicamy sposób oglądania, wybierania, dodawania, edycji i obsługi błędów.
