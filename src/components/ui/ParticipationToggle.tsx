"use client";

import ToggleSwitch from "./ToggleSwitch";

export function ParticipationBadge({
  stopped,
  stoppedLabel = "Stopped responses",
  acceptingLabel = "Accepting responses",
  className = "",
}: {
  stopped: boolean;
  stoppedLabel?: string;
  acceptingLabel?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
        stopped
          ? "border-red-500/40 bg-red-500/20 text-red-300"
          : "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${stopped ? "bg-red-400" : "bg-emerald-400"}`} />
      {stopped ? stoppedLabel : acceptingLabel}
    </span>
  );
}

export type ParticipationToggleProps = {
  /** true if participation/responses are currently STOPPED */
  stopped: boolean;
  /** Callback when state is toggled */
  onToggle: (nextStopped: boolean) => void;
  /** Whether the control is currently loading or disabled */
  disabled?: boolean;
  /**
   * Display mode:
   * - "switch": only the switch button
   * - "inline": status badge + switch (e.g. for list items, cards, headers)
   * - "card": full bordered panel with title, description, badge, and switch
   */
  variant?: "switch" | "inline" | "card";
  /** Size of the toggle switch */
  size?: "sm" | "md";
  /** Title for the card variant (defaults to "Stop Accepting Participation") */
  title?: string;
  /** Description for the card variant */
  description?: string;
  /** Status badge labels */
  stoppedLabel?: string;
  acceptingLabel?: string;
  /** Toggle switch helper label: e.g. "Stop (ON)" / "Stop (OFF)" */
  showSwitchLabel?: boolean;
  /** Whether to show the status badge */
  showBadge?: boolean;
  /** Extra container className */
  className?: string;
};

export default function ParticipationToggle({
  stopped,
  onToggle,
  disabled = false,
  variant = "card",
  size = "md",
  title = "Stop Accepting Participation",
  description,
  stoppedLabel = "Stopped responses",
  acceptingLabel = "Accepting responses",
  showSwitchLabel = true,
  showBadge = true,
  className = "",
}: ParticipationToggleProps) {
  if (variant === "switch") {
    return (
      <ToggleSwitch
        checked={stopped}
        onChange={onToggle}
        disabled={disabled}
        size={size}
        activeColor="red"
        title={stopped ? "Participation is stopped. Click to accept." : "Accepting responses. Click to stop."}
        className={className}
      />
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showBadge && (
          <ParticipationBadge
            stopped={stopped}
            stoppedLabel={stoppedLabel}
            acceptingLabel={acceptingLabel}
          />
        )}
        {showSwitchLabel && (
          <span className="text-xs text-zinc-400 hidden sm:inline">
            {stopped ? "Stop (ON)" : "Stop (OFF)"}
          </span>
        )}
        <ToggleSwitch
          checked={stopped}
          onChange={onToggle}
          disabled={disabled}
          size={size}
          activeColor="red"
          title={stopped ? "Participation is stopped. Click to accept." : "Accepting responses. Click to stop."}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-white/10 bg-zinc-900/60 p-4 ${className}`}
    >
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-white">{title}</p>
          {showBadge && (
            <ParticipationBadge
              stopped={stopped}
              stoppedLabel={stoppedLabel}
              acceptingLabel={acceptingLabel}
            />
          )}
        </div>
        {description && <p className="mt-1 text-xs text-zinc-400">{description}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
        {showSwitchLabel && (
          <span className="text-xs text-zinc-300">
            {stopped ? "Stop (ON)" : "Stop (OFF)"}
          </span>
        )}
        <ToggleSwitch
          checked={stopped}
          onChange={onToggle}
          disabled={disabled}
          size={size}
          activeColor="red"
          title={stopped ? "Participation is stopped. Click to accept." : "Accepting responses. Click to stop."}
        />
      </div>
    </div>
  );
}
