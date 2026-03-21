"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  hint?: string;
};

export function Input({ label, hint, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & FieldProps) {
  return (
    <label className="grid gap-2 text-sm text-[var(--muted)]">
      <span className="font-medium text-[var(--foreground)]">{label}</span>
      <input
        className={`rounded-3xl border border-[var(--border)] bg-white/85 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] ${className}`}
        {...props}
      />
      {hint ? <span className="text-xs">{hint}</span> : null}
    </label>
  );
}

export function Textarea({ label, hint, className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps) {
  return (
    <label className="grid gap-2 text-sm text-[var(--muted)]">
      <span className="font-medium text-[var(--foreground)]">{label}</span>
      <textarea
        className={`min-h-32 rounded-3xl border border-[var(--border)] bg-white/85 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] ${className}`}
        {...props}
      />
      {hint ? <span className="text-xs">{hint}</span> : null}
    </label>
  );
}
