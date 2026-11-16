"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Blocks, Check, Headphones, Package, Pencil, Plus, RotateCcw, Trash2, Watch } from "lucide-react";
import { SetSiteHeader } from "../layout/SiteHeader";
import { Badge, Button, ConfirmDialog, CreatableSelect, EmptyState, ErrorMessage, FormDialog, IconButton,
  Input, PageContainer, SearchInput, Select, Table, Textarea } from "@/system";

type Item = { id: string; title: string; category: string; notes: string; done: boolean; version: number; icon?: string };
const KEY = "ui-example-items-v1";
const CHANGE = "ui-example-items-change";
const INITIAL: Item[] = [
  { id: "headphones", title: "Słuchawki bezprzewodowe", category: "Elektronika", notes: "Porównać wygodę i czas pracy na baterii.", done: false, version: 1, icon: "headphones" },
  { id: "blocks", title: "Zestaw klocków", category: "Hobby", notes: "Sprawdzić wymiary po złożeniu.", done: false, version: 1, icon: "blocks" },
  { id: "watch", title: "Zegarek na co dzień", category: "Akcesoria", notes: "", done: true, version: 1, icon: "watch" },
];
function snapshot() { try { return localStorage.getItem(KEY); } catch { return null; } }
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener); window.addEventListener(CHANGE, listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener(CHANGE, listener); };
}
function readItems(raw: string | null): Item[] {
  if (raw === null) return INITIAL;
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(item => item && typeof item.id === "string" && typeof item.title === "string" &&
      typeof item.category === "string" && typeof item.notes === "string" && typeof item.done === "boolean" && typeof item.version === "number")) {
    throw new Error("Nie udało się odczytać zapisanej listy.");
  }
  return parsed;
}
function store(items: Item[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); }
  catch { throw new Error("Nie udało się zapisać w tej przeglądarce. Sprawdź dostępne miejsce i ponów próbę."); }
  window.dispatchEvent(new Event(CHANGE));
}
function normalize(value: string) { return value.normalize("NFC").trim().replace(/\s+/g, " "); }
function categoryKey(value: string) { return normalize(value).toLocaleLowerCase("pl"); }

function ItemEditor({ item, categories, onClose, onSave }: {
  item: Item | null; categories: string[]; onClose: () => void;
  onSave: (values: Pick<Item, "title" | "category" | "notes">) => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const dirty = title !== (item?.title ?? "") || category !== (item?.category ?? "") || notes !== (item?.notes ?? "");
  return <FormDialog open title={item ? "Edytuj wpis" : "Dodaj wpis"} description="Wymagana jest tylko nazwa. Pozostałe szczegóły możesz uzupełnić później."
    dirty={dirty} onClose={onClose} onSubmit={() => {
      if (!title.trim()) throw new Error("Wpisz nazwę.");
      const name = normalize(category);
      onSave({ title: title.trim(), category: categories.find(existing => categoryKey(existing) === categoryKey(name)) ?? name, notes: notes.trim() });
    }}>
    <div className="space-y-2"><label htmlFor="example-title" className="text-sm font-medium">Nazwa <span className="text-primary-700">*</span></label>
      <Input id="example-title" required maxLength={200} value={title} onChange={event => setTitle(event.target.value)} density="comfortable" surface="white" className="w-full" /></div>
    <div className="space-y-2"><label htmlFor="example-category" className="text-sm font-medium">Kategoria <span className="font-normal text-zinc-500">opcjonalnie</span></label>
      <CreatableSelect id="example-category" aria-label="Kategoria wpisu" aria-describedby="example-category-help" value={category} options={categories}
        onChange={setCategory} onCommit={setCategory} maxLength={80} placeholder="Wybierz lub wpisz własną…" density="comfortable" surface="white" />
      <p id="example-category-help" className="text-xs text-zinc-500">Wybierz z listy lub wpisz nową kategorię.</p></div>
    <div className="space-y-2"><label htmlFor="example-notes" className="text-sm font-medium">Notatka <span className="font-normal text-zinc-500">opcjonalnie</span></label>
      <Textarea id="example-notes" value={notes} onChange={event => setNotes(event.target.value)} maxLength={5000} rows={4} surface="white" className="w-full" /></div>
  </FormDialog>;
}

export function PatternExample() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  const data = useMemo(() => {
    try { return { items: readItems(raw), error: "" }; }
    catch { return { items: [] as Item[], error: "Nie udało się odczytać zapisanej listy. Przywróć przykładowe dane, aby zacząć od nowa." }; }
  }, [raw]);
  const { items } = data;
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [form, setForm] = useState<{ item: Item | null } | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const categories = [...new Map(items.filter(item => item.category).map(item => [categoryKey(item.category), item.category])).values()].sort((a, b) => a.localeCompare(b, "pl"));
  const activeCategory = categoryFilter.startsWith("c:") ? categoryFilter.slice(2) : "";
  const filterCategories = activeCategory && !categories.some(name => categoryKey(name) === categoryKey(activeCategory)) ? [...categories, activeCategory] : categories;
  const search = query.trim().toLocaleLowerCase("pl");
  const filtered = items.filter(item => (!search || `${item.title} ${item.notes} ${item.category}`.toLocaleLowerCase("pl").includes(search)) &&
    (categoryFilter === "all" || (categoryFilter === "none" ? !item.category : categoryKey(item.category) === categoryKey(activeCategory))) &&
    (status === "all" || (status === "done" ? item.done : !item.done)));
  function clearFilters() { setQuery(""); setCategoryFilter("all"); setStatus("all"); }
  function change(item: Item, update: (current: Item[]) => Item[]) {
    const current = readItems(snapshot());
    if (current.find(existing => existing.id === item.id)?.version !== item.version) {
      throw new Error("Ten wpis zmienił się w innej karcie. Zachowaliśmy formularz; otwórz aktualny wpis przed ponowną edycją.");
    }
    store(update(current));
  }
  return <PageContainer>
    <SetSiteHeader title="Przykładowa lista" description="Zwarte wiersze, szybkie akcje i edycja w modalu."
      action={<Button onClick={() => setForm({ item: null })} disabled={!!data.error} className="inline-flex items-center gap-1.5"><Plus className="size-4" />Dodaj wpis</Button>} />
    <p className="text-xs text-zinc-500">Przykładowe dane. Zmiany zapisują się tylko w tej przeglądarce.</p>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1 space-y-1"><label htmlFor="example-search" className="text-xs text-zinc-500">Wyszukiwanie</label>
        <SearchInput id="example-search" placeholder="Szukaj wpisu…" value={query} onChange={event => setQuery(event.target.value)} /></div>
      <div className="space-y-1 sm:w-52"><label htmlFor="example-category-filter" className="text-xs text-zinc-500">Kategoria</label>
        <Select id="example-category-filter" aria-label="Filtr kategorii" value={categoryFilter} onChange={setCategoryFilter} surface="white"
          options={[{ value: "all", label: "Wszystkie kategorie" }, { value: "none", label: "Bez kategorii" }, ...filterCategories.map(name => ({ value: `c:${name}`, label: name }))]} /></div>
      <div className="space-y-1 sm:w-44"><label htmlFor="example-status-filter" className="text-xs text-zinc-500">Status</label>
        <Select id="example-status-filter" aria-label="Filtr statusu" value={status} onChange={setStatus} surface="white"
          options={[{ value: "all", label: "Wszystkie statusy" }, { value: "active", label: "Do zrobienia" }, { value: "done", label: "Gotowe" }]} /></div>
      {(query || categoryFilter !== "all" || status !== "all") && <Button variant="secondary" onClick={clearFilters}>Wyczyść filtry</Button>}
    </div>
    <ErrorMessage>{error || data.error}</ErrorMessage>
    {message && <p role="status" className="text-sm text-primary-800">{message}</p>}
    <p className="text-xs text-zinc-500" aria-live="polite">Wyniki: {filtered.length} z {items.length}</p>
    {!!filtered.length && <Table.Card><Table aria-label="Przykładowe wpisy" className="table-fixed">
      <Table.Header><Table.HeaderRow><Table.Head className="px-3 py-2">Nazwa</Table.Head>
        <Table.Head className="hidden w-44 px-3 py-2 sm:table-cell">Kategoria</Table.Head>
        <Table.Head className="hidden w-36 px-3 py-2 sm:table-cell">Status</Table.Head>
        <Table.Head className="w-28 px-3 py-2 text-right">Akcje</Table.Head></Table.HeaderRow></Table.Header>
      <Table.Body>{filtered.map(item => {
        const Thumbnail = item.icon === "headphones" ? Headphones : item.icon === "blocks" ? Blocks : item.icon === "watch" ? Watch : Package;
        return <Table.Row key={item.id}>
          <Table.PrimaryCell className="px-3 py-3"><div className="flex min-w-0 items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded border border-zinc-200 bg-zinc-50 text-zinc-500"><Thumbnail aria-hidden className="size-4" /></span>
            <div className="min-w-0"><button className="text-left font-medium break-words text-zinc-900 hover:text-primary-700"
              onClick={() => setForm({ item })}>{item.title}</button>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 sm:hidden"><span>{item.category || "Bez kategorii"}</span><Badge tone={item.done ? "primary" : "muted"} size="xs">{item.done ? "Gotowe" : "Do zrobienia"}</Badge></div>
            </div></div></Table.PrimaryCell>
          <Table.Cell className="hidden px-3 py-3 break-words text-zinc-500 sm:table-cell">{item.category || "Bez kategorii"}</Table.Cell>
          <Table.Cell className="hidden px-3 py-3 sm:table-cell"><Badge tone={item.done ? "primary" : "muted"}>{item.done ? "Gotowe" : "Do zrobienia"}</Badge></Table.Cell>
          <Table.Cell className="px-2 py-2"><div className="flex justify-end">
            <IconButton label={`Edytuj: ${item.title}`} onClick={() => setForm({ item })}><Pencil className="size-4" /></IconButton>
            <IconButton label={`Usuń: ${item.title}`} tone="danger" onClick={() => setDeleting(item)}><Trash2 className="size-4" /></IconButton>
            <IconButton label={`${item.done ? "Przywróć" : "Oznacz jako gotowe"}: ${item.title}`} onClick={() => {
              setError(""); try { change(item, current => current.map(existing => existing.id === item.id ? { ...existing, done: !existing.done, version: existing.version + 1 } : existing)); setMessage(item.done ? "Wpis przywrócony." : "Oznaczono jako gotowe."); }
              catch (cause) { setError((cause as Error).message); }
            }}>{item.done ? <RotateCcw className="size-4" /> : <Check className="size-4" />}</IconButton>
          </div></Table.Cell>
        </Table.Row>;
      })}</Table.Body>
    </Table></Table.Card>}
    {!filtered.length && !data.error && <EmptyState>
      <p>{items.length ? "Brak wyników dla wybranych filtrów." : "Lista jest pusta. Dodaj pierwszy wpis."}</p>
      <Button className="mt-3" variant="secondary" onClick={items.length ? clearFilters : () => setForm({ item: null })}>{items.length ? "Wyczyść filtry" : "Dodaj pierwszy wpis"}</Button>
    </EmptyState>}
    <div><Button variant="ghost" onClick={() => { setError(""); setDeleting(null); setMessage("");
      try { store(INITIAL); clearFilters(); } catch (cause) { setError((cause as Error).message); }
    }}>Przywróć przykładowe dane</Button></div>
    {form && <ItemEditor key={form.item?.id ?? "new"} item={form.item} categories={categories} onClose={() => setForm(null)} onSave={values => {
      if (form.item) { const item = form.item; change(item, current => current.map(existing => existing.id === item.id ? { ...existing, ...values, version: existing.version + 1 } : existing)); }
      else store([{ id: crypto.randomUUID(), ...values, done: false, version: 1 }, ...readItems(snapshot())]);
      setMessage("Wpis zapisany.");
    }} />}
    {deleting && <ConfirmDialog open title="Usunąć wpis?" description={`„${deleting.title}” zniknie z listy. Tej zmiany nie można cofnąć.`}
      confirmLabel="Usuń wpis" destructive onClose={() => setDeleting(null)} onConfirm={() => {
        change(deleting, current => current.filter(item => item.id !== deleting.id)); setMessage("Wpis usunięty.");
      }} />}
  </PageContainer>;
}
