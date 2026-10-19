"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Button that shows a spinner inside itself while an action is in flight.
 *
 * While `loading` is true the leading icon is swapped for a spinning
 * <Loader2 /> and the button is disabled, so slow saves still give feedback
 * and can't be double-submitted.
 */

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  /** Leading icon, replaced by the spinner while loading. */
  icon?: LucideIcon;
  variant?: "primary" | "outline" | "danger";
  size?: "sm" | "md";
  children: ReactNode;
};

const variantStyles = {
  primary: "bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300",
  outline: "border border-white/15 text-zinc-300 hover:bg-white/10",
  danger: "bg-red-500/15 font-medium text-red-300 hover:bg-red-500/25",
} as const;

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
} as const;

export default function LoadingButton({
  loading = false,
  icon: Icon,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  className = "",
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg ${sizeStyles[size]} ${variantStyles[variant]} transition disabled:opacity-60 ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
