"use client";

import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../../forms/Button";
import { ErrorMessage } from "../ErrorMessage";

type ConfirmDialogProps = {
  open: boolean; title: string; description: React.ReactNode;
  onClose: () => void; onConfirm: () => void | Promise<void>;
  confirmLabel?: string; cancelLabel?: string; destructive?: boolean;
};

export function ConfirmDialog({ open, title, description, onClose, onConfirm,
  confirmLabel = "Potwierdź", cancelLabel = "Anuluj", destructive = false,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const opener = useRef<HTMLElement | null>(null);
  return <Dialog open={open} onOpenChange={next => { if (!next && !lock.current) { setError(""); onClose(); } }}>
    <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white"
      onOpenAutoFocus={() => { opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }}
      onCloseAutoFocus={event => { event.preventDefault(); if (opener.current?.isConnected) opener.current.focus(); }}
      onEscapeKeyDown={event => { if (lock.current) event.preventDefault(); }}
      onPointerDownOutside={event => { if (lock.current) event.preventDefault(); }}>
      <DialogHeader className="text-left"><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
      <ErrorMessage>{error}</ErrorMessage>
      <DialogFooter>
        <Button disabled={busy} variant="secondary" onClick={() => { if (!lock.current) { setError(""); onClose(); } }}>{cancelLabel}</Button>
        <Button disabled={busy} className={destructive ? "bg-destructive hover:bg-destructive/90" : undefined}
          onClick={async () => {
            if (lock.current) return;
            lock.current = true; setBusy(true); setError("");
            try { await onConfirm(); onClose(); }
            catch (cause) { setError(cause instanceof Error ? cause.message : "Nie udało się wykonać operacji. Spróbuj ponownie."); }
            finally { lock.current = false; setBusy(false); }
          }}>{busy ? "Proszę czekać…" : confirmLabel}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
