"use client";

import { FormEvent, useEffect, useState } from "react";
import { GripVertical, KeyRound, ListOrdered, LogOut, Save, ShieldCheck, ArrowDown, ArrowUp, UsersRound } from "lucide-react";

type CommitteeName = { _id: string; name: string };
type Section = "access" | "mun" | "order";

function toLines(values: string[]) {
  return values.join("\n");
}

function toEmails(value: string) {
  return [...new Set(value.split(/[\n,]+/).map((email) => email.trim().toLowerCase()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function AdminSidebar({ section, onSectionChange, onLogout }: {
  section: Section;
  onSectionChange: (section: Section) => void;
  onLogout: () => void;
}) {
  const items = [
    { id: "access" as const, label: "Access control", icon: KeyRound },
    { id: "mun" as const, label: "MUN dashboard access", icon: UsersRound },
    { id: "order" as const, label: "Committee order", icon: ListOrdered },
  ];

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-zinc-900/80 p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="rounded-lg bg-amber-400 p-2 text-zinc-950"><ShieldCheck size={18} /></div>
        <div><p className="font-semibold">Shishir Admin</p><p className="text-xs text-zinc-500">Settings</p></div>
      </div>
      <nav className="mt-6 space-y-1">
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => onSectionChange(id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${section === id ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
            <Icon size={17} />{label}
          </button>
        ))}
      </nav>
      <button type="button" onClick={onLogout} className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white">
        <LogOut size={17} />Sign out
      </button>
    </aside>
  );
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eventCreators, setEventCreators] = useState("");
  const [committeeHeads, setCommitteeHeads] = useState("");
  const [munDashboardEmails, setMunDashboardEmails] = useState("");
  const [committeeNames, setCommitteeNames] = useState<CommitteeName[]>([]);
  const [committeeOrder, setCommitteeOrder] = useState<string[]>([]);
  const [section, setSection] = useState<Section>("access");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const loadSettings = async () => {
    const response = await fetch("/api/admin/settings");
    if (!response.ok) {
      setAuthenticated(false);
      return;
    }
    const data = await response.json();
    setEventCreators(toLines(data.settings.eventCreatorEmails || []));
    setCommitteeHeads(toLines(data.settings.committeeHeadEmails || []));
    setMunDashboardEmails(toLines(data.settings.munDashboardEmails || []));
    setCommitteeNames(data.settings.committeeNames || []);
    const configured = data.settings.committeeOrder || [];
    const configuredSet = new Set(configured);
    setCommitteeOrder([...configured, ...(data.settings.committeeNames || []).map((item: CommitteeName) => item._id).filter((id: string) => !configuredSet.has(id))]);
    setAuthenticated(true);
  };

  useEffect(() => {
    loadSettings().finally(() => setLoading(false));
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/auth", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setMessage("Invalid admin credentials");
      return;
    }
    setPassword("");
    await loadSettings();
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventCreatorEmails: toEmails(eventCreators),
        committeeHeadEmails: toEmails(committeeHeads),
        munDashboardEmails: toEmails(munDashboardEmails),
        committeeOrder,
      }),
    });
    if (response.ok) {
      setMessage("Settings saved");
    } else {
      const data = await response.json().catch(() => ({}));
      setMessage(data.message || "Could not save settings");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  const moveCommittee = (id: string, direction: -1 | 1) => {
    setCommitteeOrder((current) => {
      const index = current.indexOf(id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const dropCommittee = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setCommitteeOrder((current) => {
      const next = current.filter((id) => id !== draggedId);
      next.splice(next.indexOf(targetId), 0, draggedId);
      return next;
    });
    setDraggedId(null);
  };

  if (loading) return <main className="min-h-screen bg-zinc-950 p-8 text-white">Loading...</main>;

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <form onSubmit={login} className="w-full max-w-md space-y-5 rounded-xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-400">Shishir Admin</p>
          <h1 className="text-3xl font-semibold">Access control</h1>
          <input className="w-full rounded-lg border border-white/10 bg-zinc-800 p-3" type="email" placeholder="Admin email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input className="w-full rounded-lg border border-white/10 bg-zinc-800 p-3" type="password" placeholder="Admin password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="w-full rounded-lg bg-amber-400 p-3 font-semibold text-zinc-950" type="submit">Sign in</button>
          {message && <p className="text-sm text-red-300">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-white md:flex-row">
      <AdminSidebar section={section} onSectionChange={(next) => { setSection(next); setMessage(""); }} onLogout={logout} />
      <form onSubmit={save} className="w-full max-w-5xl space-y-8 p-6 md:p-12">
        <header>
          <p className="text-sm uppercase tracking-[0.25em] text-amber-400">Settings</p>
          <h1 className="mt-2 text-4xl font-semibold">{section === "access" ? "Access control" : section === "mun" ? "MUN dashboard access" : "Committee order"}</h1>
          <p className="mt-2 text-zinc-400">{section === "access" ? "Manage who can create events and committees." : section === "mun" ? "Choose which registered users can manage MUN posts and assignments." : "Drag committees into the order they should appear across the site."}</p>
        </header>
        {section === "access" ? (
          <section className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2"><span className="font-medium">Event creator emails</span><textarea className="min-h-64 w-full rounded-lg border border-white/10 bg-zinc-900 p-3 font-mono text-sm" value={eventCreators} onChange={(event) => setEventCreators(event.target.value)} placeholder="one email per line" /></label>
            <label className="space-y-2"><span className="font-medium">Committee head emails</span><textarea className="min-h-64 w-full rounded-lg border border-white/10 bg-zinc-900 p-3 font-mono text-sm" value={committeeHeads} onChange={(event) => setCommitteeHeads(event.target.value)} placeholder="one email per line" /></label>
          </section>
        ) : section === "mun" ? (
          <section className="max-w-2xl">
            <label className="space-y-2"><span className="font-medium">MUN dashboard users</span><textarea className="min-h-64 w-full rounded-lg border border-white/10 bg-zinc-900 p-3 font-mono text-sm" value={munDashboardEmails} onChange={(event) => setMunDashboardEmails(event.target.value)} placeholder="one email per line" /></label>
          </section>
        ) : (
          <section className="max-w-2xl space-y-2">
            {committeeOrder.map((id, index) => {
              const committee = committeeNames.find((item) => item._id === id);
              if (!committee) return null;
              return <div key={id} draggable onDragStart={() => setDraggedId(id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropCommittee(id)} className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-900 p-3">
                <GripVertical className="text-zinc-500" size={18} /><span className="flex-1">{committee.name}</span>
                <button type="button" aria-label={`Move ${committee.name} up`} onClick={() => moveCommittee(id, -1)} disabled={index === 0} className="rounded p-1 text-zinc-400 hover:bg-white/10 disabled:opacity-30"><ArrowUp size={16} /></button>
                <button type="button" aria-label={`Move ${committee.name} down`} onClick={() => moveCommittee(id, 1)} disabled={index === committeeOrder.length - 1} className="rounded p-1 text-zinc-400 hover:bg-white/10 disabled:opacity-30"><ArrowDown size={16} /></button>
              </div>;
            })}
            {committeeOrder.length === 0 && <p className="rounded-lg border border-dashed border-white/15 p-6 text-zinc-500">No committee names have been created yet.</p>}
          </section>
        )}
        <div className="flex items-center gap-4"><button className="flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-zinc-950" type="submit"><Save size={17} />Save settings</button>{message && <p className="text-sm text-emerald-300">{message}</p>}</div>
      </form>
    </main>
  );
}
