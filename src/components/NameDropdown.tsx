"use client";

type NameOption = {
  _id: string;
  name: string;
};

interface NameDropdownProps {
  label: string;
  options: NameOption[];
  value: string;
  onChange: (value: string) => void;
  newValue: string;
  onNewValueChange: (value: string) => void;
  newLabel: string;
}

export default function NameDropdown({
  label,
  options,
  value,
  onChange,
  newValue,
  onNewValueChange,
  newLabel,
}: NameDropdownProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-zinc-300">{label}</span>
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
      >
        <option value="" disabled>
          Select a {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
        <option value="new">+ Create new {label.toLowerCase()}</option>
      </select>
      {value === "new" && (
        <input
          required
          value={newValue}
          onChange={(event) => onNewValueChange(event.target.value)}
          placeholder={newLabel}
          className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
        />
      )}
    </label>
  );
}
