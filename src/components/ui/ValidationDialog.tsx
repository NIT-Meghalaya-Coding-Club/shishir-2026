"use client";

import { AlertTriangle, X } from "lucide-react";

type ValidationDialogProps = {
  open: boolean;
  message: string;
  onClose: () => void;
  title?: string;
};

export default function ValidationDialog({
  open,
  message,
  onClose,
  title = "Please check your input",
}: ValidationDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-16 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="validation-dialog-title"
    >
      <div className="w-full max-w-md rounded-lg border border-amber-400/50 bg-zinc-950 p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <h2 id="validation-dialog-title" className="text-lg font-semibold text-amber-300">
              {title}
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm text-zinc-200">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close validation message"
            className="rounded-md p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
        >
          Okay
        </button>
      </div>
    </div>
  );
}
