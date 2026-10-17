"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  GripVertical,
  KeyRound,
  ListOrdered,
  LogOut,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  UsersRound,
  CalendarDays,
  ContactRound,
} from "lucide-react";
import UploadsPanel from "@/components/admin/UploadsPanel";
import SacPostsPanel from "@/components/admin/SacPostsPanel";
import NameDropdown from "@/components/NameDropdown";
import ImageCropper, { MAX_IMAGE_SIZE_MB } from "@/components/ImageCropper";
import ValidationDialog from "@/components/ui/ValidationDialog";

type CommitteeName = { _id: string; name: string };
type Person = { name?: string; email?: string; collegeID?: string };
type Committee = {
  code: string;
  committeeNameId?: CommitteeName;
  committeeHeads: Person[];
  coordinators: Person[];
  coCoordinators: Person[];
  committeeHeadEmails?: string;
  coordinatorEmails?: string;
  coCoordinatorEmails?: string;
};
type EventItem = {
  code: string;
  eventNameId?: CommitteeName;
  categoryId?: CommitteeName;
  location: string;
  startsAt: string;
  endsAt: string;
  description: string;
  eventType: string;
  minParticipants: number;
  maxParticipants: number;
  allowPerformanceTypes?: boolean;
  paymentRequired?: { amount?: number; qrCodeUrl?: string };
  rulebookLink: string;
  posterLink: string;
  eventHeads: Person[];
  coordinators: Person[];
  coCoordinators: Person[];
  name?: string;
  category?: string;
  eventHeadEmails?: string;
  coordinatorEmails?: string;
  coCoordinatorEmails?: string;
};
type ManagedItem =
  | { kind: "committees"; item: Committee }
  | { kind: "events"; item: EventItem };
type Section =
  | "access"
  | "mun"
  | "order"
  | "schedule"
  | "committees"
  | "events"
  | "uploads"
  | "sac";
type ScheduleDates = { day1: string; day2: string; day3: string };

const input =
  "w-full rounded-lg border border-white/10 bg-zinc-900 p-3 text-sm";
const peopleText = (people: Person[] = []) =>
  people
    .map((person) => person.email || "")
    .filter(Boolean)
    .join("\n");
const dateValue = (value: string) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

function AdminSidebar({
  section,
  onSectionChange,
  onLogout,
}: {
  section: Section;
  onSectionChange: (section: Section) => void;
  onLogout: () => void;
}) {
  const items = [
    ["access", "Access control", KeyRound],
    ["mun", "MUN dashboard access", UsersRound],
    ["order", "Committee order", ListOrdered],
    ["schedule", "Schedule dates", CalendarDays],
    ["committees", "Committees", UsersRound],
    ["events", "Events", CalendarDays],
    ["uploads", "Uploads", CalendarDays],
    ["sac", "SAC posts", ContactRound],
  ] as const;
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-zinc-900/80 p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="rounded-lg bg-amber-400 p-2 text-zinc-950">
          <ShieldCheck size={18} />
        </div>
        <div>
          <p className="font-semibold">Shishir Admin</p>
          <p className="text-xs text-zinc-500">Management</p>
        </div>
      </div>
      <nav className="mt-6 space-y-1">
        {items.map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${section === id ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>
      <button
        type="button"
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
      >
        <LogOut size={17} />
        Sign out
      </button>
    </aside>
  );
}
function PeopleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium">{label} emails</span>
      <textarea
        className={`${input} min-h-24 font-mono`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="one email per line"
      />
    </label>
  );
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<Section>("access");
  const [eventCreators, setEventCreators] = useState("");
  const [committeeHeads, setCommitteeHeads] = useState("");
  const [munEmails, setMunEmails] = useState("");
  const [scheduleDates, setScheduleDates] = useState<ScheduleDates>({
    day1: "",
    day2: "",
    day3: "",
  });
  const [committeeNames, setCommitteeNames] = useState<CommitteeName[]>([]);
  const [categories, setCategories] = useState<CommitteeName[]>([]);
  const [eventNames, setEventNames] = useState<CommitteeName[]>([]);
  const [committeeOrder, setCommitteeOrder] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(
    null,
  );
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [creatingEvent, setCreatingEvent] = useState(false);

  const loadSettings = async () => {
    const response = await fetch("/api/admin/settings");
    if (!response.ok) {
      setAuthenticated(false);
      return;
    }
    const data = await response.json();
    const settings = data.settings;
    setEventCreators((settings.eventCreatorEmails || []).join("\n"));
    setCommitteeHeads((settings.committeeHeadEmails || []).join("\n"));
    setMunEmails((settings.munDashboardEmails || []).join("\n"));
    setScheduleDates(
      settings.scheduleDates || { day1: "", day2: "", day3: "" },
    );
    setCommitteeNames(settings.committeeNames || []);
    const configured = settings.committeeOrder || [];
    const ids = (settings.committeeNames || []).map(
      (item: CommitteeName) => item._id,
    );
    setCommitteeOrder([
      ...configured,
      ...ids.filter((id: string) => !configured.includes(id)),
    ]);
    setAuthenticated(true);
  };
  const loadManaged = async () => {
    const [committeeResponse, eventResponse, categoriesResponse, eventNamesResponse] = await Promise.all([
      fetch("/api/admin/committees"),
      fetch("/api/admin/events"),
      fetch("/api/categories"),
      fetch("/api/event-names"),
    ]);
    if (committeeResponse.ok)
      setCommittees((await committeeResponse.json()).committees);
    if (eventResponse.ok) setEvents((await eventResponse.json()).events);
    if (categoriesResponse.ok)
      setCategories((await categoriesResponse.json()).categories);
    if (eventNamesResponse.ok)
      setEventNames((await eventNamesResponse.json()).eventNames);
  };
  useEffect(() => {
    loadSettings().finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (authenticated && (section === "committees" || section === "events"))
      loadManaged();
  }, [authenticated, section]);
  const login = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setMessage("Invalid admin credentials");
      return;
    }
    setPassword("");
    await loadSettings();
  };
  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventCreatorEmails: eventCreators
          .split(/[\n,]+/)
          .map((v) => v.trim())
          .filter(Boolean),
        committeeHeadEmails: committeeHeads
          .split(/[\n,]+/)
          .map((v) => v.trim())
          .filter(Boolean),
        munDashboardEmails: munEmails
          .split(/[\n,]+/)
          .map((v) => v.trim())
          .filter(Boolean),
        committeeOrder,
        scheduleDates,
      }),
    });
    setMessage(response.ok ? "Settings saved" : "Could not save settings");
  };
  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };
  const moveCommittee = (id: string, direction: -1 | 1) =>
    setCommitteeOrder((current) => {
      const index = current.indexOf(id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length)
        return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  const saveManaged = async (managed: ManagedItem) => {
    const { kind, item } = managed;
    const payload =
      kind === "committees"
        ? {
            ...item,
            name: item.committeeNameId?.name,
            committeeHeadEmails:
              item.committeeHeadEmails || peopleText(item.committeeHeads),
            coordinatorEmails:
              item.coordinatorEmails || peopleText(item.coordinators),
            coCoordinatorEmails:
              item.coCoordinatorEmails || peopleText(item.coCoordinators),
          }
        : {
            ...item,
            name: item.name || item.eventNameId?.name,
            category: item.category || item.categoryId?.name,
            eventHeadEmails:
              item.eventHeadEmails || peopleText(item.eventHeads),
            coordinatorEmails:
              item.coordinatorEmails || peopleText(item.coordinators),
            coCoordinatorEmails:
              item.coCoordinatorEmails || peopleText(item.coCoordinators),
            startsAt: new Date(item.startsAt).toISOString(),
            endsAt: new Date(item.endsAt).toISOString(),
          };
    const response = await fetch(`/api/admin/${kind}/${item.code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setMessage(
      response.ok ? "Changes saved" : data.message || "Could not save changes",
    );
    if (response.ok) {
      setEditingCommittee(null);
      setEditingEvent(null);
      await loadManaged();
    }
  };

  const deleteEvent = async (item: EventItem) => {
    if (!window.confirm(`Delete event "${item.eventNameId?.name || item.code}"?`)) return;
    const response = await fetch(`/api/admin/events/${item.code}`, { method: "DELETE" });
    const data = await response.json(); setMessage(response.ok ? "Event deleted" : data.message || "Could not delete event");
    if (response.ok) { setEditingEvent(null); await loadManaged(); }
  };

  if (loading)
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-white">
        Loading...
      </main>
    );
  if (!authenticated)
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <form
          onSubmit={login}
          className="w-full max-w-md space-y-5 rounded-xl border border-white/10 bg-zinc-900 p-8 shadow-2xl"
        >
          <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
            Shishir Admin
          </p>
          <h1 className="text-3xl font-semibold">Access control</h1>
          <input
            className={input}
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={input}
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full rounded-lg bg-amber-400 p-3 font-semibold text-zinc-950"
            type="submit"
          >
            Sign in
          </button>
          {message && <p className="text-sm text-red-300">{message}</p>}
        </form>
      </main>
    );

  const heading =
    section === "access"
      ? "Access control"
      : section === "mun"
        ? "MUN dashboard access"
        : section === "order"
          ? "Committee order"
          : section === "schedule"
            ? "Schedule dates"
            : section === "committees"
              ? "Committees"
              : section === "events"
                ? "Events"
                : section === "sac"
                  ? "SAC posts"
                  : "Uploads";
  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-white md:flex-row">
      <AdminSidebar
        section={section}
        onSectionChange={(next) => {
          setSection(next);
          setMessage("");
          setEditingCommittee(null);
          setEditingEvent(null);
          setCreatingEvent(false);
        }}
        onLogout={logout}
      />
      <div className="w-full max-w-6xl space-y-8 p-6 md:p-12">
        <header>
          <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
            Admin panel
          </p>
          <h1 className="mt-2 text-4xl font-semibold">{heading}</h1>
          <p className="mt-2 text-zinc-400">
            {section === "committees"
              ? "Review every committee and edit its members."
              : section === "events"
                ? "Review events, poster links, and all event details."
                : "Manage site administration settings."}
          </p>
        </header>
        {section === "access" && (
          <form onSubmit={saveSettings} className="grid gap-6 md:grid-cols-2">
            <PeopleField
              label="Event creator"
              value={eventCreators}
              onChange={setEventCreators}
            />
            <PeopleField
              label="Committee head"
              value={committeeHeads}
              onChange={setCommitteeHeads}
            />
            <div className="md:col-span-2">
              <SaveButton message={message} />
            </div>
          </form>
        )}
        {section === "mun" && (
          <form onSubmit={saveSettings} className="max-w-2xl space-y-5">
            <PeopleField
              label="MUN dashboard user"
              value={munEmails}
              onChange={setMunEmails}
            />
            <SaveButton message={message} />
          </form>
        )}
        {section === "order" && (
          <form onSubmit={saveSettings} className="max-w-2xl space-y-3">
            {committeeOrder.map((id, index) => {
              const item = committeeNames.find((name) => name._id === id);
              return (
                item && (
                  <div
                    key={id}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-900 p-3"
                    draggable
                    onDragStart={() => setDraggedId(id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (!draggedId) return;
                      setCommitteeOrder((current) => {
                        const next = current.filter(
                          (value) => value !== draggedId,
                        );
                        next.splice(next.indexOf(id), 0, draggedId);
                        return next;
                      });
                      setDraggedId(null);
                    }}
                  >
                    <GripVertical size={18} className="text-zinc-500" />
                    <span className="flex-1">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => moveCommittee(id, -1)}
                      disabled={!index}
                      className="p-1 disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCommittee(id, 1)}
                      disabled={index === committeeOrder.length - 1}
                      className="p-1 disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                )
              );
            })}
            <SaveButton message={message} />
          </form>
        )}
        {section === "schedule" && (
          <form onSubmit={saveSettings} className="max-w-2xl space-y-5">
            <p className="text-sm text-zinc-400">
              Events are shown according to the date in their start time.
            </p>
            {(["day1", "day2", "day3"] as const).map((day, index) => (
              <label key={day} className="block space-y-2">
                <span className="text-sm font-medium">
                  Day {index + 1} date
                </span>
                <input
                  className={input}
                  type="date"
                  value={scheduleDates[day]}
                  onChange={(event) =>
                    setScheduleDates((current) => ({
                      ...current,
                      [day]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
            <SaveButton message={message} />
          </form>
        )}
        {section === "committees" &&
          (editingCommittee ? (
            <CommitteeEditor
              item={editingCommittee}
              onChange={setEditingCommittee}
              onCancel={() => setEditingCommittee(null)}
              onSave={() =>
                saveManaged({ kind: "committees", item: editingCommittee })
              }
            />
          ) : (
            <List
              items={committees}
              getTitle={(item) => item.committeeNameId?.name || item.code}
              getMeta={(item) =>
                `${item.committeeHeads.length} heads · ${item.coordinators.length} coordinators`
              }
              onEdit={setEditingCommittee}
            />
          ))}
        {section === "events" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Manage events</h2>
              {!creatingEvent && !editingEvent && (
                <button
                  type="button"
                  onClick={() => {
                    setCreatingEvent(true);
                    setMessage("");
                    setEditingEvent(null);
                  }}
                  className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
                >
                  <Plus size={17} /> Create event
                </button>
              )}
            </div>
            {creatingEvent ? (
              <CreateEventEditor
                categories={categories}
                eventNames={eventNames}
                onCancel={() => setCreatingEvent(false)}
                onSuccess={() => {
                  setCreatingEvent(false);
                  loadManaged();
                }}
              />
            ) : editingEvent ? (
              <EventEditor
                item={editingEvent}
                onChange={setEditingEvent}
                onCancel={() => setEditingEvent(null)}
                onSave={() =>
                  saveManaged({ kind: "events", item: editingEvent })
                }
              />
            ) : (
              <List
                items={events}
                getTitle={(item) => item.eventNameId?.name || item.code}
                getMeta={(item) =>
                  `${item.categoryId?.name || "Uncategorised"} · ${new Date(item.startsAt).toLocaleString()}`
                }
                onEdit={setEditingEvent}
                onDelete={deleteEvent}
              />
            )}
          </div>
        )}
        {section === "uploads" && <UploadsPanel />}
        {section === "sac" && <SacPostsPanel />}
      </div>
    </main>
  );
}

function SaveButton({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-4">
      <button
        className="flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-zinc-950"
        type="submit"
      >
        <Save size={17} />
        Save
      </button>
      {message && <p className="text-sm text-emerald-300">{message}</p>}
    </div>
  );
}
function List<T extends { code: string }>({
  items,
  getTitle,
  getMeta,
  onEdit, onDelete,
}: {
  items: T[];
  getTitle: (item: T) => string;
  getMeta: (item: T) => string;
  onEdit: (item: T) => void; onDelete?: (item: T) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.code}
          className="flex items-center gap-4 rounded-xl border border-white/10 bg-zinc-900 p-4"
        >
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{getTitle(item)}</p>
            <p className="mt-1 text-sm text-zinc-400">{getMeta(item)}</p>
            <p className="mt-1 font-mono text-xs text-zinc-600">{item.code}</p>
          </div>
          <div className="flex items-center gap-2"><button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-lg bg-white/10 p-2 text-zinc-300 hover:bg-amber-400 hover:text-zinc-950"
            aria-label={`Edit ${getTitle(item)}`}
          >
            <Edit3 size={17} />
          </button>
        {onDelete && <button type="button" onClick={() => onDelete(item)} className="rounded-lg border border-red-500/30 p-2 text-red-400 hover:bg-red-500 hover:text-white" aria-label={`Delete ${getTitle(item)}`}><Trash2 size={16} /></button>}</div></div>
      ))}
      {!items.length && (
        <p className="rounded-lg border border-dashed border-white/15 p-6 text-zinc-500">
          Nothing to show.
        </p>
      )}
    </div>
  );
}

function CommitteeEditor({
  item,
  onChange,
  onCancel,
  onSave,
}: {
  item: Committee;
  onChange: (item: Committee) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const update = (key: string, value: string) =>
    onChange({ ...item, [key]: value });
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span>Name</span>
          <input
            className={input}
            value={item.committeeNameId?.name || ""}
            onChange={(e) =>
              onChange({
                ...item,
                committeeNameId: {
                  ...(item.committeeNameId || { _id: "" }),
                  name: e.target.value,
                },
              })
            }
          />
        </label>
        <label className="space-y-2">
          <span>Code (cannot be changed)</span>
          <input
            className={`${input} cursor-not-allowed opacity-60`}
            value={item.code}
            readOnly
            disabled
          />
        </label>
        <PeopleField
          label="Committee head"
          value={item.committeeHeadEmails ?? peopleText(item.committeeHeads)}
          onChange={(value) => update("committeeHeadEmails", value)}
        />
        <PeopleField
          label="Coordinator"
          value={item.coordinatorEmails ?? peopleText(item.coordinators)}
          onChange={(value) => update("coordinatorEmails", value)}
        />
        <PeopleField
          label="Co-coordinator"
          value={item.coCoordinatorEmails ?? peopleText(item.coCoordinators)}
          onChange={(value) => update("coCoordinatorEmails", value)}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-amber-400 px-5 py-3 font-semibold text-zinc-950"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-white/15 px-5 py-3"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function EventEditor({
  item,
  onChange,
  onCancel,
  onSave,
}: {
  item: EventItem;
  onChange: (item: EventItem) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const update = (key: string, value: unknown) =>
    onChange({ ...item, [key]: value });
  const uploadPoster = async (file: File) => {
    setUploading(true);
    setUploadMessage("");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`/api/admin/events/${item.code}/poster`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      update("posterLink", data.publicUrl);
      setUploadMessage("Poster uploaded. Save changes to apply it.");
    } else setUploadMessage(data.message || "Could not upload poster");
    setUploading(false);
  };
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["name", item.name ?? item.eventNameId?.name ?? ""],
          ["code", item.code],
          ["category", item.category ?? item.categoryId?.name ?? ""],
          ["location", item.location],
          ["rulebookLink", item.rulebookLink],
        ].map(([key, value]) => (
          <label key={key} className="space-y-2">
            <span className="capitalize">{key}</span>
            <input
              className={input}
              value={value}
              readOnly={key === "code"}
              onChange={(e) => update(key, e.target.value)}
            />
          </label>
        ))}
        <div className="space-y-2">
          <span className="block">Poster</span>
          {item.posterLink && (
            <a
              className="block truncate text-sm text-amber-300 underline"
              href={item.posterLink}
              target="_blank"
              rel="noreferrer"
            >
              View current poster
            </a>
          )}
          <input
            className={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onClick={(e) => {
              e.currentTarget.value = "";
            }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadPoster(file);
            }}
          />
          {uploadMessage && (
            <p className="text-xs text-zinc-400">{uploadMessage}</p>
          )}
        </div>
        <label className="space-y-2">
          <span>Starts at</span>
          <input
            className={input}
            type="datetime-local"
            value={dateValue(item.startsAt)}
            onChange={(e) => update("startsAt", e.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span>Ends at</span>
          <input
            className={input}
            type="datetime-local"
            value={dateValue(item.endsAt)}
            onChange={(e) => update("endsAt", e.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span>Participation type</span>
          <select
            className={input}
            value={item.eventType}
            onChange={(e) => update("eventType", e.target.value)}
          >
            <option value="individual">Individual</option>
            <option value="team">Team</option>
            <option value="performance">Performance</option>
          </select>
        </label>
        <label className="space-y-2">
          <span>Minimum participants</span>
          <input
            className={input}
            type="number"
            min="1"
            value={item.minParticipants}
            onChange={(e) => update("minParticipants", Number(e.target.value))}
          />
        </label>
        <label className="space-y-2">
          <span>Maximum participants</span>
          <input
            className={input}
            type="number"
            min="1"
            value={item.maxParticipants}
            onChange={(e) => update("maxParticipants", Number(e.target.value))}
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span>Description</span>
          <textarea
            className={`${input} min-h-32`}
            value={item.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </label>
        <PeopleField
          label="Event head"
          value={item.eventHeadEmails ?? peopleText(item.eventHeads)}
          onChange={(value) => update("eventHeadEmails", value)}
        />
        <PeopleField
          label="Coordinator"
          value={item.coordinatorEmails ?? peopleText(item.coordinators)}
          onChange={(value) => update("coordinatorEmails", value)}
        />
        <PeopleField
          label="Co-coordinator"
          value={item.coCoordinatorEmails ?? peopleText(item.coCoordinators)}
          onChange={(value) => update("coCoordinatorEmails", value)}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={uploading}
          className="rounded-lg bg-amber-400 px-5 py-3 font-semibold text-zinc-950 disabled:opacity-50"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-white/15 px-5 py-3"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function CreateEventEditor({ categories, eventNames, onCancel, onSuccess }: { categories: CommitteeName[]; eventNames: CommitteeName[]; onCancel: () => void; onSuccess: () => void }) {
  type CreateEventForm = {
    eventNameId: string;
    name: string;
    categoryId: string;
    category: string;
    location: string;
    startsAt: string;
    endsAt: string;
    description: string;
    rulebookLink: string;
    eventType: "individual" | "team" | "performance";
    minParticipants: number;
    maxParticipants: number;
    allowPerformanceTypes: boolean;
    paymentRequired: { amount: number; qrCodeUrl: string } | null;
    posterLink: string;
    posterFile: File | null;
    eventHeadEmails: string;
    coordinatorEmails: string;
    coCoordinatorEmails: string;
  };

  const [formData, setFormData] = useState<CreateEventForm>({
    eventNameId: "",
    name: "",
    categoryId: "",
    category: "",
    location: "",
    startsAt: "",
    endsAt: "",
    description: "",
    rulebookLink: "",
    eventType: "individual",
    minParticipants: 1,
    maxParticipants: 1,
    allowPerformanceTypes: false,
    paymentRequired: null,
    posterLink: "",
    posterFile: null,
    eventHeadEmails: "",
    coordinatorEmails: "",
    coCoordinatorEmails: "",
  });
  const [newEventName, setNewEventName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [posterToCrop, setPosterToCrop] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const update = (key: string, value: unknown) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleNameChange = (eventNameId: string) => {
    const selected = eventNames.find((item) => item._id === eventNameId);
    setFormData((prev) => ({ ...prev, eventNameId, name: selected?.name || "" }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const selected = categories.find((item) => item._id === categoryId);
    setFormData((prev) => ({ ...prev, categoryId, category: selected?.name || "" }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setValidationMessage("");
    if (!formData.eventHeadEmails.trim()) {
      toast.error("Add at least one event head");
      return;
    }
    try {
      setSaving(true);

      let categoryId = formData.categoryId;
      let categoryName = formData.category;
      let eventNameId = formData.eventNameId;
      let eventName = formData.name;

      if (eventNameId === "new") {
        eventName = newEventName.trim();
        if (!eventName) { toast.error("Enter a new event name"); return; }
        const res = await fetch("/api/event-names", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: eventName }) });
        const d = await res.json();
        if (!res.ok) { toast.error(d.message || "Could not create event name"); return; }
        eventNameId = d.eventName._id;
        eventName = d.eventName.name;
      }

      if (categoryId === "new") {
        categoryName = newCategoryName.trim();
        if (!categoryName) { toast.error("Enter a new category name"); return; }
        const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: categoryName }) });
        const d = await res.json();
        if (!res.ok) { toast.error(d.message || "Could not create category"); return; }
        categoryId = d.category._id;
        categoryName = d.category.name;
      }

      let posterLink = formData.posterLink;
      if (formData.posterFile) {
        const fd = new FormData();
        fd.append("file", formData.posterFile);
        const res = await fetch("/api/admin/events/poster", { method: "POST", body: fd });
        const d = await res.json();
        if (!res.ok) { toast.error(d.message || "Could not upload poster"); return; }
        posterLink = d.publicUrl;
      }

      if (!posterLink) { toast.error("Choose a poster image."); return; }

      const payload = {
        name: eventName,
        eventNameId,
        category: categoryName,
        categoryId,
        location: formData.location.trim(),
        startsAt: formData.startsAt,
        endsAt: formData.endsAt,
        description: formData.description.trim(),
        eventType: formData.eventType,
        minParticipants: Number(formData.minParticipants),
        maxParticipants: Number(formData.maxParticipants),
        allowPerformanceTypes: formData.allowPerformanceTypes,
        paymentRequired: formData.paymentRequired,
        rulebookLink: formData.rulebookLink.trim(),
        posterLink: posterLink.trim(),
        eventHeadEmails: formData.eventHeadEmails,
        coordinatorEmails: formData.coordinatorEmails,
        coCoordinatorEmails: formData.coCoordinatorEmails,
      };

      const res = await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const d = await res.json();
      if (!res.ok) { toast.error(d.message || "Could not create event"); return; }
      toast.success("Event created");
      onSuccess();
    } catch (error) {
      console.error("Create event failed:", error);
      toast.error("Could not create event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="space-y-5">
      <ValidationDialog open={Boolean(validationMessage)} message={validationMessage} onClose={() => setValidationMessage("")} />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Create Event</h2>
        <button type="button" onClick={onCancel} disabled={saving} className="rounded-lg border border-white/15 px-5 py-3 text-sm text-zinc-300 hover:bg-white/10 disabled:opacity-60">Cancel</button>
      </div>
      <form onSubmit={submit} className="grid gap-5 md:grid-cols-2 border border-white/10 bg-white/[0.04] p-5 rounded-xl">
        <NameDropdown
          label="Event Name"
          options={eventNames}
          value={formData.eventNameId || ""}
          onChange={handleNameChange}
          newValue={newEventName}
          onNewValueChange={setNewEventName}
          newLabel="New event name"
        />
        <NameDropdown
          label="Category"
          options={categories}
          value={formData.categoryId || ""}
          onChange={handleCategoryChange}
          newValue={newCategoryName}
          onNewValueChange={setNewCategoryName}
          newLabel="New category name"
        />
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-zinc-300">Location</span>
          <input required value={formData.location} onChange={(e) => update("location", e.target.value)} className={input} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-zinc-300">Start Date and Time</span>
          <input required type="datetime-local" value={formData.startsAt} onChange={(e) => update("startsAt", e.target.value)} className={input} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-zinc-300">End Date and Time</span>
          <input required type="datetime-local" value={formData.endsAt} onChange={(e) => update("endsAt", e.target.value)} className={input} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-zinc-300">Rulebook Link</span>
          <input required type="url" value={formData.rulebookLink} onChange={(e) => update("rulebookLink", e.target.value)} className={input} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="block text-sm font-medium text-zinc-300">Poster Image</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file) setPosterToCrop(file); }} className={input} />
          <p className="text-xs text-zinc-500">JPEG, PNG, or WebP. {MAX_IMAGE_SIZE_MB} MB or smaller.</p>
          {formData.posterLink && (
            <a href={formData.posterLink} target="_blank" rel="noreferrer" className="inline-block text-xs text-zinc-400 underline hover:text-white">View current poster</a>
          )}
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-zinc-300">Description</span>
          <textarea required rows={4} value={formData.description} onChange={(e) => update("description", e.target.value)} className={`${input} font-mono`} />
        </label>

        <div className="md:col-span-2 border-t border-white/10 pt-4">
          <h3 className="font-semibold text-amber-300 mb-3">Registration Settings</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-300">Participation Type</span>
              <select required value={formData.eventType} onChange={(e) => update("eventType", e.target.value)} className={input}>
                <option value="individual">Individual</option>
                <option value="team">Team</option>
                <option value="performance">Performance</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-300">Minimum Participants</span>
              <input required min={1} type="number" value={formData.minParticipants} onChange={(e) => update("minParticipants", Number(e.target.value))} className={input} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-300">Maximum Participants</span>
              <input required min={formData.minParticipants || 1} type="number" value={formData.maxParticipants} onChange={(e) => update("maxParticipants", Number(e.target.value))} className={input} />
            </label>
          </div>
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input type="checkbox" checked={formData.allowPerformanceTypes} onChange={(e) => update("allowPerformanceTypes", e.target.checked)} className="h-4 w-4 accent-amber-400" />
            Let participants choose solo, duo, trio, or group
          </label>
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input type="checkbox" checked={Boolean(formData.paymentRequired)} onChange={(e) => update("paymentRequired", e.target.checked ? { amount: 0, qrCodeUrl: "" } : null)} className="h-4 w-4 accent-amber-400" />
            Require payment during registration
          </label>
          {formData.paymentRequired && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-300">Payment Amount (INR)</span>
                <input required min={0} type="number" value={formData.paymentRequired.amount} onChange={(e) => update("paymentRequired", formData.paymentRequired ? { ...formData.paymentRequired, amount: Number(e.target.value) } : { amount: Number(e.target.value), qrCodeUrl: "" })} className={input} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-300">Payment QR Code URL</span>
                <input required type="url" value={formData.paymentRequired.qrCodeUrl} onChange={(e) => update("paymentRequired", formData.paymentRequired ? { ...formData.paymentRequired, qrCodeUrl: e.target.value } : { amount: 0, qrCodeUrl: e.target.value })} className={input} />
              </label>
            </div>
          )}
        </div>

        <div className="md:col-span-2 border-t border-white/10 pt-4">
          <h3 className="font-semibold text-amber-300 mb-3">Event Team (typed emails)</h3>
          <p className="text-sm text-zinc-400 mb-4">Enter one email per line. Emails must belong to registered users.</p>
          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-300">Event Head emails</span>
            <textarea className={`${input} min-h-32 font-mono`} value={formData.eventHeadEmails} onChange={(e) => update("eventHeadEmails", e.target.value)} placeholder="one email per line" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-300">Coordinator emails</span>
            <textarea className={`${input} min-h-32 font-mono`} value={formData.coordinatorEmails} onChange={(e) => update("coordinatorEmails", e.target.value)} placeholder="one email per line" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-300">Co-coordinator emails</span>
            <textarea className={`${input} min-h-32 font-mono`} value={formData.coCoordinatorEmails} onChange={(e) => update("coCoordinatorEmails", e.target.value)} placeholder="one email per line" />
          </label>
        </div>

        <div className="flex justify-end md:col-span-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Create Event
          </button>
        </div>
      </form>
    </div>
    {posterToCrop && (
      <ImageCropper
        file={posterToCrop}
        onComplete={(croppedFile) => {
          setFormData((prev) => ({ ...prev, posterFile: croppedFile }));
          setPosterToCrop(null);
        }}
        onCancel={() => setPosterToCrop(null)}
      />
    )}
    </>
  );
}

