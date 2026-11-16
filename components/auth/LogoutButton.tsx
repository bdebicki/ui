"use client";

import { useState } from "react";
import { Button } from "@/system";

export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <div className="flex items-center gap-2">
    {error && <span role="alert" className="max-w-48 text-xs text-white">{error}</span>}
    <Button variant="ghost" className="px-2 py-0.5 text-xs text-zinc-300 hover:text-white" disabled={busy}
      onClick={async () => {
        setBusy(true); setError("");
        try {
          const response = await fetch("/api/session", { method: "DELETE" });
          if (!response.ok) throw new Error("Nie udało się wylogować.");
          window.location.assign("/login");
        } catch {
          setError("Nie udało się wylogować. Ponów próbę."); setBusy(false);
        }
      }}>{busy ? "Wylogowywanie…" : "Wyloguj"}</Button>
  </div>;
}
