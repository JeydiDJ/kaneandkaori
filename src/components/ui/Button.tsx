"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_10px_24px_rgba(125,78,51,0.26)] hover:brightness-95",
  secondary: "border border-[var(--border)] bg-white/85 text-[var(--foreground)] hover:bg-[var(--surface)]/80",
  ghost: "text-[var(--foreground)] hover:bg-white/60",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.02em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
