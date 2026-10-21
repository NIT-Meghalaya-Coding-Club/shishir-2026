// Event times are stored in MongoDB as UTC instants, but they are authored and
// displayed in IST (Asia/Kolkata, a fixed +05:30 with no daylight saving).
//
// Keep every timezone conversion and every event time formatter in this file so
// the admin panel, the event-head dashboard and the public pages always agree,
// no matter which timezone the browser or the Node server happens to run in.

export const IST_TIME_ZONE = "Asia/Kolkata";
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export type DateInput = string | number | Date | null | undefined;

// Matches the value produced by <input type="datetime-local">, with or without
// seconds, e.g. "2026-11-05T10:30" or "2026-11-05T10:30:00.000". These values
// have no timezone attached, so they must be read as IST wall clock time.
const IST_WALL_CLOCK_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/;

/**
 * Parse a value into a date.
 *
 * - Values without a timezone (datetime-local input values) are treated as IST.
 * - ISO strings with `Z` / `+05:30`, numbers and Date objects keep their instant.
 *
 * Returns null for empty or invalid values.
 */
export function parseISTDateTime(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const text = String(value).trim();
  if (!text) return null;

  const iso = IST_WALL_CLOCK_PATTERN.test(text) ? `${text}+05:30` : text;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Stored UTC instant -> `YYYY-MM-DDTHH:mm` value for a
 * `<input type="datetime-local">`, shown in IST.
 */
export function toISTInputValue(value: DateInput): string {
  const date = parseISTDateTime(value);
  if (!date) return "";
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 16);
}

/**
 * IST wall-clock input -> UTC ISO string to send to the API. Values that are
 * already instants are returned unchanged as ISO strings. Returns "" for empty
 * or invalid values.
 */
export function toISTInstant(value: DateInput): string {
  const date = parseISTDateTime(value);
  return date ? date.toISOString() : "";
}

/**
 * UTC instants covering a whole IST calendar day, e.g. "2026-11-05".
 * Returns null when the day is missing or malformed.
 */
export function getISTDayRange(day: string): { start: Date; end: Date } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const start = parseISTDateTime(`${day}T00:00:00`);
  const end = parseISTDateTime(`${day}T23:59:59.999`);
  return start && end ? { start, end } : null;
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function istFormatter(options: Intl.DateTimeFormatOptions) {
  const key = JSON.stringify(options);
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: IST_TIME_ZONE,
      ...options,
    });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

/** Format an event instant as an IST date, e.g. "5 Nov 2026". */
export function formatISTDate(
  value: DateInput,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  }
): string {
  const date = parseISTDateTime(value);
  return date ? istFormatter(options).format(date) : "";
}

/** Format an event instant as an IST time, e.g. "10:30 am". */
export function formatISTTime(
  value: DateInput,
  options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  }
): string {
  const date = parseISTDateTime(value);
  return date ? istFormatter(options).format(date) : "";
}

/** Format an event instant as an IST date and time, e.g. "5 Nov 2026, 10:30 am". */
export function formatISTDateTime(
  value: DateInput,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }
): string {
  const date = parseISTDateTime(value);
  return date ? istFormatter(options).format(date) : "";
}
