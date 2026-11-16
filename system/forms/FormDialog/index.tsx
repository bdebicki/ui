"use client";

import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "../../feedback/ConfirmDialog";
import { ErrorMessage } from "../../feedback/ErrorMessage";
import { Button } from "../Button";

type FormDialogProps = {
  open: boolean; title: string; description: string; dirty: boolean;
  children: React.ReactNode; onClose: () => void;
  /** Reject/throw on failure. Only a successful save closes the form. */
  onSubmit: () => void | Promise<void>;
  submitLabel?: string;
};

/** Keep mounted while editing; use a fresh key for a different record. */
export function FormDialog({ open, title, description, dirty, children, onClose, onSubmit, submitLabel = "Zapisz" }: FormDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [discarding, setDiscarding] = useState(false);
  const lock = useRef(false);
  const opener = useRef<HTMLElement | null>(null);
  const content = useRef<HTMLDivElement>(null);
  function close() {
    if (lock.current) return;
    if (dirty) setDiscarding(true);
    else { setError(""); onClose(); }
  }
  return <>
    <Dialog open={open} onOpenChange={next => { if (!next) close(); }}>
      <DialogContent ref={content} showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white sm:max-w-xl"
        onOpenAutoFocus={event => {
          event.preventDefault();
          opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          content.current?.querySelector<HTMLElement>('form input:not([disabled]):not([type="hidden"]), form textarea:not([disabled]), form button:not([disabled])')?.focus();
        }}
        onCloseAutoFocus={event => { event.preventDefault(); if (opener.current?.isConnected) opener.current.focus(); }}
        onEscapeKeyDown={event => { if (lock.current) event.preventDefault(); }}
        onPointerDownOutside={event => { if (lock.current) event.preventDefault(); }}>
        <DialogHeader className="pr-8 text-left"><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
        <button type="button" aria-label="Zamknij formularz" disabled={busy} onClick={close}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded text-xl text-zinc-500 hover:bg-zinc-100 disabled:opacity-40">×</button>
        <form className="space-y-5" onSubmit={async event => {
          event.preventDefault();
          if (lock.current) return;
          lock.current = true; setBusy(true); setError("");
          try { await onSubmit(); onClose(); }
          catch (cause) { setError(cause instanceof Error ? cause.message : "Nie udało się zapisać. Spróbuj ponownie."); }
          finally { lock.current = false; setBusy(false); }
        }} aria-busy={busy}>
          <fieldset disabled={busy} className="min-w-0 space-y-4 disabled:opacity-60">{children}</fieldset>
          <ErrorMessage>{error}</ErrorMessage>
          <DialogFooter>
            <Button variant="secondary" disabled={busy} onClick={close}>Anuluj</Button>
            <Button type="submit" size="md" disabled={busy}>{busy ? "Zapisywanie…" : submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    <ConfirmDialog open={discarding} title="Odrzucić zmiany?" description="Niezapisane zmiany zostaną utracone."
      cancelLabel="Wróć do edycji" confirmLabel="Odrzuć zmiany" destructive
      onClose={() => setDiscarding(false)} onConfirm={() => { setDiscarding(false); setError(""); onClose(); }} />
  </>;
}
