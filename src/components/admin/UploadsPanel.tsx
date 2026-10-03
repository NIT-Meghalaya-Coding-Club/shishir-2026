"use client";

import { ChevronLeft, ChevronRight, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type UploadItem = {
  id: string;
  type: string;
  eventName?: string | null;
  imageUrl?: string | null;
  uploader: { name: string; email?: string | null };
  isProcessed: boolean;
  originalSize: number;
  processedSize: number;
  createdAt: string;
  updatedAt: string;
};

const indianDate = (value: string) => new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
}).format(new Date(value));

const bytes = (value: number) => {
  if (!value) return "—";
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(2)} KB`;
  return `${(value / 1024 / 1024).toFixed(2)} MB`;
};

export default function UploadsPanel() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<UploadItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/admin/uploads?page=${page}&search=${encodeURIComponent(search)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load uploads");
        if (active) {
          setUploads(data.uploads);
          setTotalPages(data.totalPages || 1);
          setError("");
        }
      })
      .catch((reason) => active && setError(reason.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [page, search]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const deleteUpload = async (upload: UploadItem) => {
    if (!window.confirm("Delete this image and its upload record?")) return;
    setDeleting(true);
    try {
      const response = await fetch("/api/admin/uploads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: upload.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete upload");
      setUploads((current) => current.filter((item) => item.id !== upload.id));
      if (selected?.id === upload.id) setSelected(null);
      if (uploads.length === 1 && page > 1) setPage((current) => current - 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete upload");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="text-zinc-400">Loading uploads...</p>;
  if (error) return <p className="text-red-300">{error}</p>;
  return <div className="space-y-5">
    <form onSubmit={submitSearch} className="flex max-w-2xl gap-2">
      <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search by name, email, or event name" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-zinc-900 p-3 text-sm outline-none focus:border-amber-400" />
      <button type="submit" className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-3 text-sm font-semibold text-zinc-950"><Search size={17} />Search</button>
    </form>
    {!uploads.length ? <p className="text-zinc-400">No uploads found.</p> : <>
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead className="bg-zinc-900 text-left text-xs uppercase tracking-wider text-zinc-500">
          <tr><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Uploaded by</th><th className="px-4 py-3 font-medium">Event</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Preview</th></tr>
        </thead>
        <tbody>
          {uploads.map((upload) => <tr key={upload.id} tabIndex={0} onClick={() => setSelected(upload)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelected(upload); }} className="cursor-pointer border-t border-white/10 bg-zinc-950 transition hover:bg-white/5">
            <td className="px-4 py-4 font-medium capitalize">{upload.type}</td>
            <td className="px-4 py-4"><strong className="block font-medium">{upload.uploader.name}</strong><small className="text-zinc-500">{upload.uploader.email || "Admin upload"}</small></td>
            <td className="px-4 py-4 text-zinc-300">{upload.eventName || "—"}</td>
            <td className={`px-4 py-4 ${upload.isProcessed ? "text-emerald-300" : "text-amber-300"}`}>{upload.isProcessed ? "Processed" : "Not processed"}</td>
            <td className="px-4 py-4"><span className="flex items-center gap-2"><span className="h-16 w-24 overflow-hidden rounded-lg bg-zinc-900">{upload.imageUrl ? <img src={upload.imageUrl} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-xs text-zinc-600">No image</span>}</span><button type="button" aria-label={`Delete ${upload.type} upload`} onClick={(event) => { event.stopPropagation(); void deleteUpload(upload); }} className="rounded-lg p-2 text-red-300 hover:bg-red-500/15"><Trash2 size={17} /></button></span></td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
      <div className="flex gap-2"><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-white/10 p-2 disabled:opacity-30"><ChevronLeft size={18} /></button><button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-white/10 p-2 disabled:opacity-30"><ChevronRight size={18} /></button></div>
    </div>
    </>}
    {selected && <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/80 p-6" onClick={() => setSelected(null)}>
      <section className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-white/10 bg-zinc-900 p-6" onClick={(event) => event.stopPropagation()}>
        <button type="button" aria-label="Close upload details" onClick={() => setSelected(null)} className="absolute right-4 top-4 rounded-lg p-2 hover:bg-white/10"><X size={20} /></button>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-80 items-center justify-center rounded-lg bg-zinc-950 p-3">{selected.imageUrl ? <img src={selected.imageUrl} alt={`${selected.type} upload`} className="max-h-[65vh] max-w-full object-contain" /> : <span className="text-zinc-500">No image available</span>}</div>
          <div className="space-y-4"><h2 className="text-2xl font-semibold capitalize">{selected.type} upload</h2><div><p className="font-medium">{selected.uploader.name}</p><p className="text-sm text-zinc-400">{selected.uploader.email || "Admin upload"}</p></div><dl className="space-y-3 text-sm"><div><dt className="text-zinc-500">Processed</dt><dd>{selected.isProcessed ? "Yes" : "No"}</dd></div><div><dt className="text-zinc-500">Size before</dt><dd>{bytes(selected.originalSize)}</dd></div><div><dt className="text-zinc-500">Size after</dt><dd>{bytes(selected.processedSize)}</dd></div><div><dt className="text-zinc-500">Created at (IST)</dt><dd>{indianDate(selected.createdAt)}</dd></div><div><dt className="text-zinc-500">Updated at (IST)</dt><dd>{indianDate(selected.updatedAt)}</dd></div></dl><button type="button" disabled={deleting} onClick={() => void deleteUpload(selected)} className="flex items-center gap-2 rounded-lg bg-red-500/15 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/25 disabled:opacity-50"><Trash2 size={16} />{deleting ? "Deleting..." : "Delete image and record"}</button></div>
        </div>
      </section>
    </div>}
  </div>;
}
