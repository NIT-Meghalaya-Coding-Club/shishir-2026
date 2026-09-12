"use client";

import { FormEvent, useEffect, useState } from "react";

function toLines(values: string[]) {
  return values.join("\n");
}

function toEmails(value: string) {
  return value.split(/[\n,]+/).map((email) => email.trim()).filter(Boolean);
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eventCreators, setEventCreators] = useState("");
  const [committeeHeads, setCommitteeHeads] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadSettings = async () => {
    const response = await fetch("/api/admin/settings");
    if (!response.ok) {
      setAuthenticated(false);
      return;
    }

    const data = await response.json();
    setEventCreators(toLines(data.settings.eventCreatorEmails));
    setCommitteeHeads(toLines(data.settings.committeeHeadEmails));
    setAuthenticated(true);
  };

  useEffect(() => {
    loadSettings().finally(() => setLoading(false));
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
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

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventCreatorEmails: toEmails(eventCreators),
        committeeHeadEmails: toEmails(committeeHeads),
      }),
    });

    setMessage(response.ok ? "Settings saved" : "Could not save settings");
  };

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  if (loading) return <main className="min-h-screen bg-zinc-950 p-8 text-white">Loading...</main>;

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <form onSubmit={login} className="w-full max-w-md space-y-5 rounded-xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-amber-400">Shishir Admin</p>
            <h1 className="mt-2 text-3xl font-semibold">Access control</h1>
          </div>
          <input className="w-full rounded-lg border border-white/10 bg-zinc-800 p-3" type="email" placeholder="Admin email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input className="w-full rounded-lg border border-white/10 bg-zinc-800 p-3" type="password" placeholder="Admin password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="w-full rounded-lg bg-amber-400 p-3 font-semibold text-zinc-950" type="submit">Sign in</button>
          {message && <p className="text-sm text-red-300">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <form onSubmit={save} className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-amber-400">Shishir Admin</p>
            <h1 className="mt-2 text-4xl font-semibold">Access control</h1>
            <p className="mt-2 text-zinc-400">Manage who can create events and committees.</p>
          </div>
          <button type="button" onClick={logout} className="rounded-lg border border-white/15 px-4 py-2 text-sm">Sign out</button>
        </header>
        <section className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2">
            <span className="font-medium">Event creator emails</span>
            <textarea className="min-h-64 w-full rounded-lg border border-white/10 bg-zinc-900 p-3 font-mono text-sm" value={eventCreators} onChange={(event) => setEventCreators(event.target.value)} placeholder="one email per line" />
          </label>
          <label className="space-y-2">
            <span className="font-medium">Committee head emails</span>
            <textarea className="min-h-64 w-full rounded-lg border border-white/10 bg-zinc-900 p-3 font-mono text-sm" value={committeeHeads} onChange={(event) => setCommitteeHeads(event.target.value)} placeholder="one email per line" />
          </label>
        </section>
        <div className="flex items-center gap-4">
          <button className="rounded-lg bg-amber-400 px-6 py-3 font-semibold text-zinc-950" type="submit">Save settings</button>
          {message && <p className="text-sm text-emerald-300">{message}</p>}
        </div>
      </form>
    </main>
  );
}
