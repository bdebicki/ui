"use client";

import { useEffect, useState } from "react";
import { AddButton, Badge, Button, Card, CreatableSelect, EmptyState, IconButton, Input, NumberInput, SegmentedControl, Table, Textarea, ToggleButton } from "@/system";

export default function ComponentsFixture() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const [text, setText] = useState("start");
  const [notes, setNotes] = useState("notes");
  const [number, setNumber] = useState(5);
  const [choice, setChoice] = useState("");
  const [commit, setCommit] = useState("");
  const [active, setActive] = useState(false);
  const [segment, setSegment] = useState("all");
  return (
    <div data-testid="fixture" data-ready={ready} className="space-y-4 p-6">
      <Card size="lg">
        <p>Geist · shadcn · primary / priority / platinum</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button>
          <IconButton label="Usuń">×</IconButton>
          <Badge tone="primary">Primary badge</Badge><Badge tone="priority">Priority</Badge><Badge tone="platinum">Platinum</Badge>
        </div>
      </Card>
      <Card href="/about">Linked card</Card>
      <Input aria-label="Buffered input" value={text} onChange={(event) => setText(event.target.value.toUpperCase())} />
      <Textarea aria-label="Buffered textarea" value={notes} onChange={(event) => setNotes(event.target.value.toUpperCase())} />
      <NumberInput aria-label="Number" min={2} value={number} onValueChange={setNumber} />
      <output data-testid="number">{number}</output>
      <CreatableSelect value={choice} options={["Alpha", "Beta", "Gamma"]} placeholder="Wybierz lub wpisz" onChange={setChoice} onCommit={setCommit} />
      <output data-testid="commit">{commit}</output>
      <ToggleButton active={active} onClick={() => setActive(!active)}>Priorytet</ToggleButton>
      <SegmentedControl value={segment} onChange={setSegment} options={[{ value: "all", label: "Wszystkie", count: 3 }, { value: "today", label: "Dzisiaj" }]} />
      <SegmentedControl value={segment} onChange={setSegment} collapseAfter={1} options={[{ value: "all", label: "Przypięte", pinned: true }, { value: "today", label: "Dzisiaj" }]} />
      <EmptyState>Brak wyników</EmptyState>
      <EmptyState variant="dashed">Dodaj pierwszy wpis</EmptyState>
      <AddButton>Dodaj</AddButton>
      <Table.Card><Table><thead><Table.HeaderRow><th>Nazwa</th></Table.HeaderRow></thead><tbody><Table.Row priority><Table.PrimaryCell priority sticky>Wyróżniony</Table.PrimaryCell></Table.Row></tbody></Table></Table.Card>
      <Button onClick={() => document.getElementById("bottom-choice")?.scrollIntoView()}>Na dół</Button>
      <div className="h-[100vh]" />
      <div id="bottom-choice"><CreatableSelect options={["Dolna opcja"]} placeholder="Przy dolnej krawędzi" /></div>
    </div>
  );
}
