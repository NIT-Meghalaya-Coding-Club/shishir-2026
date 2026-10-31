"use client";

import type { ButtonHTMLAttributes } from "react";

export type ToggleSwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md";
  activeColor?: "red" | "emerald" | "amber";
  title?: string;
  ariaLabel?: string;
};

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  activeColor = "red",
  title,
  ariaLabel,
  className = "",
  ...props
}: ToggleSwitchProps) {
  const isSm = size === "sm";

  const activeColorClass =
    activeColor === "red"
      ? "bg-red-500"
      : activeColor === "amber"
      ? "bg-amber-400"
      : "bg-emerald-500";

  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onChange(!checked);
        }
      }}
      title={title}
      className={`relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
        isSm ? "h-5 w-9" : "h-6 w-11"
      } ${checked ? activeColorClass : "bg-zinc-700 hover:bg-zinc-600"} ${className}`}
    >
      <span
        className={`pointer-events-none inline-block rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isSm ? "h-4 w-4" : "h-5 w-5"
        } ${
          checked
            ? isSm
              ? "translate-x-4"
              : "translate-x-5"
            : "translate-x-0"
        }`}
      />
    </button>
  );
}
