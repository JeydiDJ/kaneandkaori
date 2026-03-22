"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  hint?: string;
};

export function Input({ label, hint, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & FieldProps) {
  return (
    <label className="grid gap-2 text-sm text-[var(--muted)]">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span>
      <input
        className={`rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none transition duration-200 placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 ${className}`}
        {...props}
      />
      {hint ? <span className="text-xs">{hint}</span> : null}
    </label>
  );
}

export function Textarea({ label, hint, className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps) {
  return (
    <label className="grid gap-2 text-sm text-[var(--muted)]">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span>
      <textarea
        className={`min-h-32 rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none transition duration-200 placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 ${className}`}
        {...props}
      />
      {hint ? <span className="text-xs">{hint}</span> : null}
    </label>
  );
}
