"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90",
  secondary: "border border-[var(--border)] bg-white/80 text-[var(--foreground)] hover:bg-[var(--surface)]",
  ghost: "text-[var(--foreground)] hover:bg-white/60",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
