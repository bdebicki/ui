"use client";

import { useState } from "react";
import { Button, Card, ErrorMessage, Input, PageContainer } from "@/system";

export function LoginForm({ returnTo, configured, numeric }: { returnTo: string; configured: boolean; numeric: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return <PageContainer className="flex-1 justify-center py-12">
    <Card className="mx-auto w-full max-w-sm" size="lg">
      <h1 className="text-xl font-semibold">Zaloguj się</h1>
      <p className="mt-2 text-sm text-zinc-500">Wpisz PIN lub hasło do aplikacji. To urządzenie zapamiętamy na 30 dni.</p>
      {!configured && <ErrorMessage className="mt-4">Dostęp nie jest skonfigurowany. Ustaw APP_PASSWORD i SESSION_SECRET na serwerze.</ErrorMessage>}
      <form className="mt-6 space-y-4" onSubmit={async (event) => {
        event.preventDefault();
        if (busy) return;
        setBusy(true); setError("");
        try {
          const response = await fetch("/api/session", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Nie udało się zalogować.");
          window.location.assign(returnTo);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : "Błąd połączenia. Spróbuj ponownie.");
          setBusy(false);
        }
      }}>
        <div className="space-y-2">
          <label htmlFor="app-password" className="text-sm font-medium">PIN lub hasło</label>
          <Input id="app-password" name="password" type="password" autoComplete="current-password"
            inputMode={numeric ? "numeric" : "text"}
            autoFocus required minLength={4} maxLength={1024} value={password}
            disabled={busy || !configured} onChange={(event) => setPassword(event.target.value)}
            density="comfortable" surface="white" className="w-full" />
        </div>
        <ErrorMessage>{error}</ErrorMessage>
        <Button type="submit" size="md" fullWidth disabled={busy || !configured}>
          {busy ? "Logowanie…" : "Zaloguj się"}
        </Button>
      </form>
    </Card>
  </PageContainer>;
}
