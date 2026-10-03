"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Pencil, Plus, Save, Search, Trash2, UserPlus, X } from "lucide-react";

type Person = { _id: string; name?: string; email: string; collegeID?: string; dept?: string };
type MunPost = { _id: string; title: string; users: Person[]; order: number };

export default function MunDashboard() {
  const [posts, setPosts] = useState<MunPost[]>([]);
  const [title, setTitle] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<Person[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [message, setMessage] = useState("");

  const loadPosts = async () => {
    const response = await fetch("/api/mun");
    if (response.status === 403) {
      setMessage("You do not have access to the MUN dashboard.");
      setLoading(false);
      return;
    }
    const data = await response.json();
    if (!response.ok) setMessage(data.message || "Could not load MUN posts");
    else setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  const resetForm = () => { setEditingId(""); setTitle(""); setAssignedUsers([]); setQuery(""); setResults([]); };

  const searchUsers = async () => {
    const searchQuery = query.trim();
    if (!searchQuery) {
      setResults([]);
      return;
    }

    const response = await fetch(`/api/users/search?query=${encodeURIComponent(searchQuery)}`);
    if (response.ok) setResults((await response.json()).users || []);
    else setMessage("Could not search users");
  };

  const savePost = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true); setMessage("");
    const response = await fetch("/api/mun", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId || undefined, title, userIds: assignedUsers.map((user) => user._id) }),
    });
    const data = await response.json();
    if (!response.ok) setMessage(data.message || "Could not save post");
    else { resetForm(); await loadPosts(); }
    setSaving(false);
  };

  const editPost = (post: MunPost) => { setEditingId(post._id); setTitle(post.title); setAssignedUsers(post.users); setMessage(""); };

  const deletePost = async (id: string) => {
    if (!window.confirm("Delete this MUN post and its assignments?")) return;
    const response = await fetch(`/api/mun?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) setMessage((await response.json()).message || "Could not delete post");
    else await loadPosts();
  };

  const addUser = (user: Person) => {
    if (!assignedUsers.some((assigned) => assigned._id === user._id)) setAssignedUsers((current) => [...current, user]);
    setQuery(""); setResults([]);
  };

  const moveAssignedUser = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= assignedUsers.length) return;
    setAssignedUsers((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const savePostOrder = async () => {
    setSavingOrder(true);
    const response = await fetch("/api/mun", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts: posts.map((post) => ({ id: post._id })) }),
    });
    if (!response.ok) {
      setMessage((await response.json()).message || "Could not save post order");
    } else {
      setMessage("Post order saved");
    }
    setSavingOrder(false);
  };

  const movePost = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= posts.length) return;
    setPosts((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  if (loading) return <main className="min-h-screen bg-zinc-950 p-8 text-white">Loading MUN dashboard...</main>;

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-400">MUN</p>
          <h1 className="mt-2 text-4xl font-semibold">MUN dashboard</h1>
          <p className="mt-2 text-zinc-400">Create posts and assign one or more users to each post.</p>
        </header>
        {message && <p className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{message}</p>}
        <form onSubmit={savePost} className="mb-10 space-y-5 rounded-xl border border-white/10 bg-zinc-900 p-6">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{editingId ? "Edit post" : "Add post"}</h2>{editingId && <button type="button" onClick={resetForm} className="text-sm text-zinc-400 hover:text-white">Cancel</button>}</div>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post name (for example: Delegate)" maxLength={120} required className="w-full rounded-lg border border-white/10 bg-zinc-800 p-3" />
          <div className="relative">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-800 p-2">
              <UserPlus size={18} className="ml-1 text-zinc-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users by name or email" className="w-full bg-transparent p-1 outline-none" />
              <button type="button" onClick={searchUsers} aria-label="Search users" className="rounded-md bg-amber-400 p-2 text-zinc-950 transition hover:bg-amber-300">
                <Search size={17} />
              </button>
            </div>
            {results.length > 0 && <div className="absolute z-10 mt-2 w-full rounded-lg border border-white/10 bg-zinc-800 p-2 shadow-xl">{results.map((user) => <button type="button" key={user._id} onClick={() => addUser(user)} className="block w-full rounded p-2 text-left hover:bg-white/10"><span>{user.name || user.email}</span><span className="ml-2 text-xs text-zinc-400">{user.email}</span></button>)}</div>}
          </div>
          <div className="space-y-2">{assignedUsers.map((user, index) => <div key={user._id} className="flex items-center gap-2 rounded-lg bg-amber-400/15 px-3 py-2 text-sm text-amber-200"><GripVertical size={15} className="text-amber-300/60" /><span className="flex-1">{user.name || user.email}</span><button type="button" onClick={() => moveAssignedUser(index, -1)} disabled={index === 0} aria-label={`Move ${user.name || user.email} up`} className="rounded p-1 hover:bg-white/10 disabled:opacity-30"><ArrowUp size={14} /></button><button type="button" onClick={() => moveAssignedUser(index, 1)} disabled={index === assignedUsers.length - 1} aria-label={`Move ${user.name || user.email} down`} className="rounded p-1 hover:bg-white/10 disabled:opacity-30"><ArrowDown size={14} /></button><button type="button" onClick={() => setAssignedUsers((current) => current.filter((item) => item._id !== user._id))} aria-label={`Remove ${user.name || user.email}`}><X size={14} /></button></div>)}</div>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-zinc-950 disabled:opacity-50">{editingId ? <Save size={17} /> : <Plus size={17} />}{saving ? "Saving..." : editingId ? "Save changes" : "Add post"}</button>
        </form>
        {posts.length > 1 && (
          <div className="mb-6 flex justify-end">
            <button type="button" onClick={savePostOrder} disabled={savingOrder} className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-zinc-950 disabled:opacity-50">
              <Save size={17} />
              {savingOrder ? "Saving order..." : "Save order"}
            </button>
          </div>
        )}
        <section className="grid gap-4 md:grid-cols-2">
          {posts.map((post, index) => <article key={post._id} className="rounded-xl border border-white/10 bg-zinc-900 p-5"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-2"><GripVertical size={18} className="text-zinc-500" /><h2 className="text-xl font-semibold">{post.title}</h2></div><div className="flex gap-1"><button type="button" onClick={() => movePost(index, -1)} disabled={index === 0} aria-label={`Move ${post.title} up`} className="rounded p-2 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30"><ArrowUp size={17} /></button><button type="button" onClick={() => movePost(index, 1)} disabled={index === posts.length - 1} aria-label={`Move ${post.title} down`} className="rounded p-2 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30"><ArrowDown size={17} /></button><button type="button" onClick={() => editPost(post)} aria-label={`Edit ${post.title}`} className="rounded p-2 text-zinc-400 hover:bg-white/10 hover:text-white"><Pencil size={17} /></button><button type="button" onClick={() => deletePost(post._id)} aria-label={`Delete ${post.title}`} className="rounded p-2 text-zinc-400 hover:bg-red-400/10 hover:text-red-300"><Trash2 size={17} /></button></div></div><div className="mt-4 space-y-2">{post.users.map((user) => <div key={user._id} className="rounded-lg bg-zinc-800 p-3"><p>{user.name || user.email}</p><p className="text-xs text-zinc-400">{user.email}{user.collegeID ? ` · ${user.collegeID}` : ""}</p></div>)}</div></article>)}
          {posts.length === 0 && <p className="rounded-xl border border-dashed border-white/15 p-8 text-zinc-500">No MUN posts yet.</p>}
        </section>
      </div>
    </main>
  );
}
