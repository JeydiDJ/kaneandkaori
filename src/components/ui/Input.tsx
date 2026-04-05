"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

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

export function Select({ label, hint, className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & FieldProps) {
  return (
    <label className="grid gap-2 text-sm text-[var(--muted)]">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span>
      <span className="relative">
        <select
          className={`w-full appearance-none rounded-2xl border border-[var(--border)] bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(243,237,225,0.82))] px-4 py-3 pr-12 text-[var(--foreground)] shadow-[0_12px_28px_rgba(0,0,0,0.05)] outline-none transition duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 ${className}`}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--muted)]">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M5.75 7.75 10 12.25l4.25-4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      {hint ? <span className="text-xs">{hint}</span> : null}
    </label>
  );
}
