"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Page title + one-line description + right-aligned actions. */
export function PageHeader({ title, description, actions }: { title: string; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-brand text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** White card with an optional titled header. */
export function Panel({
  title,
  description,
  actions,
  children,
  className = "",
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-border bg-card shadow-sm ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export type SaveState = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string };

/** Floating save indicator (bottom-right). "Saved" fades after a moment; errors stay until dismissed. */
export function SaveToast({ state, onDismiss }: { state: SaveState; onDismiss: () => void }) {
  useEffect(() => {
    if (state.kind !== "saved") return;
    const t = setTimeout(onDismiss, 2200);
    return () => clearTimeout(t);
  }, [state, onDismiss]);

  if (state.kind === "idle") return <div role="status" aria-live="polite" className="sr-only" />;
  const tone =
    state.kind === "error" ? "bg-red-600 text-white" : state.kind === "saved" ? "bg-emerald-600 text-white" : "bg-foreground text-background";
  return (
    <div
      role={state.kind === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`fixed right-4 bottom-4 z-[60] flex max-w-sm items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg ${tone}`}
    >
      {state.kind === "saving" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {state.kind === "saved" && <Check className="size-4" aria-hidden="true" />}
      {state.kind === "error" && <AlertTriangle className="size-4" aria-hidden="true" />}
      <span>{state.kind === "saving" ? "Saving…" : state.kind === "saved" ? "Saved" : state.message}</span>
      {state.kind === "error" && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="ml-1 rounded-full p-0.5 hover:bg-white/20">
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/** Pill-shaped single-select, e.g. All / Dining Room / After Hours. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly (readonly [T, string])[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg bg-muted p-1">
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            value === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/**
 * Right-side sheet built on <dialog>, so focus trapping, Esc to close and the backdrop come
 * from the browser. Footer is sticky; the body scrolls.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      className="admin-theme m-0 ml-auto h-dvh max-h-none w-full max-w-2xl bg-card p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex open:flex-col"
    >
      <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
        <div>
          <h2 id={titleId} className="font-brand text-lg font-bold">
            {title}
          </h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X aria-hidden="true" />
        </Button>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-5">{open && children}</div>
      {footer && <footer className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/40 px-6 py-3">{footer}</footer>}
    </dialog>
  );
}

/** A button that asks "are you sure?" inline before running a destructive action. */
export function ConfirmButton({
  children,
  confirmLabel = "Yes, delete",
  prompt,
  onConfirm,
  className = "",
}: {
  children: React.ReactNode;
  confirmLabel?: string;
  prompt: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
}) {
  const [asking, setAsking] = useState(false);
  if (!asking)
    return (
      <Button type="button" variant="destructive" onClick={() => setAsking(true)} className={className}>
        {children}
      </Button>
    );
  return (
    <span className={`inline-flex flex-wrap items-center gap-2 text-sm ${className}`} role="group" aria-label="Confirm delete">
      <span className="font-medium text-destructive">{prompt}</span>
      <Button type="button" size="sm" className="bg-destructive text-white hover:bg-destructive/90" onClick={() => onConfirm()}>
        {confirmLabel}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setAsking(false)}>
        Keep it
      </Button>
    </span>
  );
}

/** Large tappable on/off card: title, one-line explanation, and a visible check. */
export function ChoiceCard({
  checked,
  onChange,
  title,
  description,
  tone = "neutral",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  description?: string;
  tone?: "neutral" | "blue" | "ink";
}) {
  const on = {
    neutral: "border-foreground/70 bg-muted/60",
    blue: "border-ds-secondary bg-ds-secondary/5",
    ink: "border-ds-ink bg-ds-ink/5",
  }[tone];
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition ${
        checked ? on : "border-border bg-card hover:border-input"
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 ${
          checked ? "border-transparent bg-foreground text-background" : "border-input"
        }`}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
    </button>
  );
}

/** Menu membership badges using the same colors as the public site's schedule pills. */
export function MenuBadge({ menu }: { menu: "lunch" | "after-hours" }) {
  return menu === "lunch" ? (
    <span className="rounded-full bg-ds-secondary/10 px-2 py-0.5 text-[11px] font-semibold text-ds-secondary">Dining Room</span>
  ) : (
    <span className="rounded-full bg-ds-ink px-2 py-0.5 text-[11px] font-semibold text-ds-paper">After Hours</span>
  );
}
