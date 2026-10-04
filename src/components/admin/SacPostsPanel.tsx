"use client";

import { useEffect, useRef, useState } from "react";
import ImageCropper, { MAX_IMAGE_SIZE_MB } from "@/components/ImageCropper";

type SacPost = {
  _id: string;
  name: string;
  post: string;
  phone: string;
  email: string;
  order: number;
  image?: string;
};
const input =
  "w-full rounded-lg border border-white/10 bg-zinc-900 p-3 text-sm";
const empty = { name: "", post: "", phone: "", email: "" };

export default function SacPostsPanel() {
  const [posts, setPosts] = useState<SacPost[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoToCrop, setPhotoToCrop] = useState<File | null>(null);
  const [photoPostId, setPhotoPostId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const clearPhotoInput = () => {
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const load = async () => {
    const response = await fetch("/api/admin/sac-posts");
    const data = await response.json();
    if (response.ok) setPosts(data.posts || []);
    else setMessage(data.message || "Could not load SAC posts");
    setLoading(false);
  };
  useEffect(() => {
    void load();
  }, []);
  const update = (key: keyof typeof empty, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(
      editing ? `/api/admin/sac-posts/${editing}` : "/api/admin/sac-posts",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Could not save SAC post");
      return;
    }
    const postId = editing || data.post?._id;
    if (photo && postId) {
      const body = new FormData();
      body.append("file", photo);
      const uploadResponse = await fetch(
        `/api/admin/sac-posts/${postId}/photo`,
        { method: "POST", body },
      );
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        setMessage(uploadData.message || "Post saved, but photo upload failed");
        setForm(empty);
        setPhoto(null);
        setEditing(null);
        clearPhotoInput();
        await load();
        return;
      }
    }
    setMessage("SAC post saved");
    setForm(empty);
    setPhoto(null);
    setEditing(null);
    clearPhotoInput();
    await load();
  };
  const upload = async (id: string, file: File) => {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch(`/api/admin/sac-posts/${id}/photo`, {
      method: "POST",
      body,
    });
    const data = await response.json();
    setMessage(
      response.ok ? "Photo uploaded" : data.message || "Could not upload photo",
    );
    if (response.ok) await load();
  };
  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= posts.length) return;
    setPosts((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };
  const saveOrder = async () => {
    const responses = await Promise.all(
      posts.map((item, index) =>
        fetch(`/api/admin/sac-posts/${item._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: index }),
        }),
      ),
    );
    if (responses.every((response) => response.ok)) {
      setPosts((current) =>
        current.map((item, index) => ({ ...item, order: index })),
      );
      setMessage("SAC post order saved");
    } else {
      setMessage("Could not save SAC post order");
      await load();
    }
  };
  const remove = async (id: string) => {
    if (!window.confirm("Delete this SAC post and its photo?")) return;
    const response = await fetch(`/api/admin/sac-posts/${id}`, {
      method: "DELETE",
    });
    if (response.ok) await load();
    else
      setMessage(
        (await response.json()).message || "Could not delete SAC post",
      );
  };
  if (loading) return <p className="text-zinc-400">Loading SAC posts...</p>;
  return (
    <div className="space-y-8">
      <form
        onSubmit={save}
        className="grid gap-4 rounded-xl border border-white/10 bg-zinc-900/60 p-5 md:grid-cols-2"
      >
        {(["name", "post", "phone", "email"] as const).map((key) => (
          <label key={key} className="space-y-2">
            <span className="text-sm capitalize">
              {key === "post" ? "Position / post" : key}
            </span>
            <input
              className={input}
              type={key === "email" ? "email" : "text"}
              required
              value={form[key]}
              onChange={(event) => update(key, event.target.value)}
            />
          </label>
        ))}
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm">Photo</span>
          <input
            ref={photoInputRef}
            className={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onClick={(event) => {
              event.currentTarget.value = "";
            }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setPhotoPostId(null);
                setPhotoToCrop(file);
              }
            }}
          />
          <span className="text-xs text-zinc-500">
            JPEG, PNG, or WebP up to 2 MB
          </span>
        </label>
        <div className="flex gap-3 md:col-span-2">
          <button
            className="rounded-lg bg-amber-400 px-5 py-3 font-semibold text-zinc-950"
            type="submit"
          >
            {editing ? "Update post" : "Add post"}
          </button>
          {editing && (
            <button
              type="button"
              className="rounded-lg border border-white/15 px-5"
              onClick={() => {
                setEditing(null);
                setForm(empty);
                setPhoto(null);
                clearPhotoInput();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {message && <p className="text-sm text-zinc-300">{message}</p>}
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-amber-400 px-5 py-3 font-semibold text-zinc-950"
          onClick={() => void saveOrder()}
        >
          Save order
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((item, index) => (
          <article
            key={item._id}
            className="rounded-xl border border-white/10 bg-zinc-900 p-4"
          >
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-950">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-zinc-600">
                    No photo
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-amber-300">{item.post}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  {item.phone}
                  <br />
                  {item.email}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                aria-label={`Move ${item.name} up`}
                disabled={index === 0}
                className="rounded-lg border border-white/15 px-3 py-2 text-sm disabled:opacity-30"
                onClick={() => move(index, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                aria-label={`Move ${item.name} down`}
                disabled={index === posts.length - 1}
                className="rounded-lg border border-white/15 px-3 py-2 text-sm disabled:opacity-30"
                onClick={() => move(index, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/15 px-3 py-2 text-sm"
                onClick={() => {
                  setEditing(item._id);
                  setForm({
                    name: item.name,
                    post: item.post,
                    phone: item.phone,
                    email: item.email,
                  });
                  setPhoto(null);
                  clearPhotoInput();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300"
                onClick={() => void remove(item._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {photoToCrop && (
        <ImageCropper
          file={photoToCrop}
          maxSizeMb={MAX_IMAGE_SIZE_MB}
          onComplete={(croppedFile) => {
            const postId = photoPostId;
            setPhotoToCrop(null);
            setPhotoPostId(null);
            if (postId) void upload(postId, croppedFile);
            else setPhoto(croppedFile);
          }}
          onCancel={() => {
            setPhotoToCrop(null);
            setPhotoPostId(null);
          }}
        />
      )}
    </div>
  );
}
