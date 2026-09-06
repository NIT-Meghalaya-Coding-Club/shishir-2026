"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  CalendarClock,
  Edit3,
  Link as LinkIcon,
  Loader2,
  MapPin,
  Plus,
  Save,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "react-toastify";

type Person = {
  _id?: string;
  user?: string;
  collegeID: string;
  name: string;
  email: string;
  phone?: string;
  dept?: string;
  yearOfStudy?: string | number;
  image?: string;
};

type EventRecord = {
  _id?: string;
  name: string;
  code: string;
  category: string;
  location: string;
  startsAt: string;
  endsAt: string;
  description: string;
  rulebookLink: string;
  posterLink: string;
  eventHeads: Person[];
  coordinators: Person[];
  coCoordinators: Person[];
};

type PeopleField = "eventHeads" | "coordinators" | "coCoordinators";

const emptyEvent: EventRecord = {
  name: "",
  code: "",
  category: "",
  location: "",
  startsAt: "",
  endsAt: "",
  description: "",
  rulebookLink: "",
  posterLink: "",
  eventHeads: [],
  coordinators: [],
  coCoordinators: [],
};

const peopleLabels: Record<PeopleField, string> = {
  eventHeads: "Event Heads",
  coordinators: "Coordinators",
  coCoordinators: "Co-coordinators",
};

function toDateTimeInputValue(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function getPersonCollegeIDs(people: Person[]) {
  return people.map((person) => person.collegeID).filter(Boolean);
}

export default function EventHeadDashboard() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [formData, setFormData] = useState<EventRecord>(emptyEvent);
  const [editingCode, setEditingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [lookupInputs, setLookupInputs] = useState<Record<PeopleField, string>>({
    eventHeads: "",
    coordinators: "",
    coCoordinators: "",
  });
  const [lookupLoading, setLookupLoading] = useState<PeopleField | null>(null);

  const isEditing = Boolean(editingCode);

  const currentUserIsInHeads = useMemo(() => {
    if (!currentUser?.collegeID) return false;
    return formData.eventHeads.some(
      (head) => head.collegeID === currentUser.collegeID
    );
  }, [currentUser, formData.eventHeads]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const fetchInitialData = async () => {
      const userEmail = session.user?.email;
      const sessionName = session.user?.name || "";
      const sessionImage = session.user?.image || "";

      if (!userEmail) return;

      try {
        setLoading(true);

        const [userResponse, eventsResponse] = await Promise.all([
          fetch(`/api/user/get-info/${userEmail}`),
          fetch("/api/events?scope=mine"),
        ]);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser({
            _id: userData.user?._id,
            collegeID: userData.user?.collegeID || "",
            name: userData.user?.name || sessionName,
            email: userData.user?.email || userEmail,
            phone: userData.user?.phone || "",
            dept: userData.user?.dept || "",
            yearOfStudy: userData.user?.yearOfStudy || "",
            image: userData.user?.image || sessionImage,
          });
        }

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.events || []);
        } else {
          toast.error("Could not load your events");
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        toast.error("Could not load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [session, status]);

  useEffect(() => {
    if (!currentUser || isEditing || currentUserIsInHeads || !currentUser.collegeID) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      eventHeads: [currentUser, ...previous.eventHeads],
    }));
  }, [currentUser, currentUserIsInHeads, isEditing]);

  const handleInputChange = (
    field: keyof Omit<EventRecord, "eventHeads" | "coordinators" | "coCoordinators">,
    value: string
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const resetForm = () => {
    setEditingCode("");
    setFormData({
      ...emptyEvent,
      eventHeads: currentUser?.collegeID ? [currentUser] : [],
    });
  };

  const editEvent = (event: EventRecord) => {
    setEditingCode(event.code);
    setFormData({
      ...event,
      startsAt: toDateTimeInputValue(event.startsAt),
      endsAt: toDateTimeInputValue(event.endsAt),
      eventHeads: event.eventHeads || [],
      coordinators: event.coordinators || [],
      coCoordinators: event.coCoordinators || [],
    });
  };

  const addPerson = async (field: PeopleField) => {
    const collegeID = lookupInputs[field].trim();

    if (!collegeID) {
      toast.info("Enter a college ID first");
      return;
    }

    if (formData[field].some((person) => person.collegeID === collegeID)) {
      toast.info("This user is already added");
      return;
    }

    try {
      setLookupLoading(field);
      const response = await fetch(
        `/api/users/by-college-id/${encodeURIComponent(collegeID)}`
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "User not found");
        return;
      }

      setFormData((previous) => ({
        ...previous,
        [field]: [...previous[field], data.user],
      }));
      setLookupInputs((previous) => ({ ...previous, [field]: "" }));
    } catch (error) {
      console.error("College ID lookup failed:", error);
      toast.error("Could not look up user");
    } finally {
      setLookupLoading(null);
    }
  };

  const removePerson = (field: PeopleField, collegeID: string) => {
    if (field === "eventHeads" && currentUser?.collegeID === collegeID) {
      toast.info("You must remain an event head to edit this event");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [field]: previous[field].filter((person) => person.collegeID !== collegeID),
    }));
  };

  const submitEvent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUser?.collegeID) {
      toast.error("Complete your profile before creating events");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...formData,
        eventHeadCollegeIDs: getPersonCollegeIDs(formData.eventHeads),
        coordinatorCollegeIDs: getPersonCollegeIDs(formData.coordinators),
        coCoordinatorCollegeIDs: getPersonCollegeIDs(formData.coCoordinators),
      };

      const response = await fetch(
        isEditing ? `/api/events/${editingCode}` : "/api/events",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Could not save event");
        return;
      }

      const savedEvent = data.event;
      setEvents((previous) => {
        const withoutSaved = previous.filter((item) => item.code !== editingCode);
        return [...withoutSaved, savedEvent].sort(
          (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );
      });
      setEditingCode(savedEvent.code);
      setFormData({
        ...savedEvent,
        startsAt: toDateTimeInputValue(savedEvent.startsAt),
        endsAt: toDateTimeInputValue(savedEvent.endsAt),
      });
      toast.success(isEditing ? "Event updated" : "Event created");
    } catch (error) {
      console.error("Save event failed:", error);
      toast.error("Could not save event");
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async () => {
    if (!editingCode) return;

    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/events/${editingCode}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Could not delete event");
        return;
      }

      setEvents((previous) => previous.filter((event) => event.code !== editingCode));
      resetForm();
      toast.success("Event deleted");
    } catch (error) {
      console.error("Delete event failed:", error);
      toast.error("Could not delete event");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-28 text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
          <span>Loading dashboard</span>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-28 text-white">
        <section className="mx-auto max-w-xl border border-white/10 bg-white/[0.04] p-6">
          <h1 className="text-3xl font-semibold text-amber-300">
            Event Head Dashboard
          </h1>
          <p className="mt-3 text-sm text-zinc-300">
            Sign in with your Google account to create and manage your events.
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/event-head/dashboard" })}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 font-semibold text-zinc-950 hover:bg-amber-300"
          >
            <UserPlus className="h-4 w-4" />
            Sign in
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-24 text-white sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-amber-300">
                Event Dashboard
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                {currentUser?.name || session?.user?.email}
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-amber-400 text-zinc-950 hover:bg-amber-300"
              title="Create event"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {events.length === 0 && (
              <p className="border border-white/10 bg-white/[0.04] p-4 text-sm text-zinc-300">
                No events assigned to you yet.
              </p>
            )}
            {events.map((event) => (
              <button
                key={event.code}
                type="button"
                onClick={() => editEvent(event)}
                className={`w-full rounded-md border p-4 text-left transition ${
                  editingCode === event.code
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-white/10 bg-white/[0.04] hover:border-white/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-white">{event.name}</h2>
                    <p className="mt-1 text-xs uppercase tracking-wide text-zinc-400">
                      {event.code}
                    </p>
                  </div>
                  <Edit3 className="h-4 w-4 text-amber-300" />
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
                  <CalendarClock className="h-4 w-4 text-zinc-500" />
                  {event.startsAt
                    ? new Date(event.startsAt).toLocaleString()
                    : "Timing pending"}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <form
          onSubmit={submitEvent}
          className="space-y-6 border border-white/10 bg-white/[0.04] p-4 sm:p-6"
        >
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? "Edit Event" : "Create Event"}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Only event heads can update these details.
              </p>
            </div>
            <div className="flex gap-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={deleteEvent}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md border border-red-400/40 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-500/10 disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </button>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">Event Name</span>
              <input
                required
                value={formData.name}
                onChange={(event) => handleInputChange("name", event.target.value)}
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">Event Code</span>
              <input
                required
                value={formData.code}
                onChange={(event) => handleInputChange("code", event.target.value)}
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">Category</span>
              <input
                required
                value={formData.category}
                onChange={(event) =>
                  handleInputChange("category", event.target.value)
                }
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="flex items-center gap-2 text-sm text-zinc-300">
                <MapPin className="h-4 w-4" />
                Location
              </span>
              <input
                required
                value={formData.location}
                onChange={(event) =>
                  handleInputChange("location", event.target.value)
                }
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">Start Date and Time</span>
              <input
                required
                type="datetime-local"
                value={formData.startsAt}
                onChange={(event) =>
                  handleInputChange("startsAt", event.target.value)
                }
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">End Date and Time</span>
              <input
                required
                type="datetime-local"
                value={formData.endsAt}
                onChange={(event) => handleInputChange("endsAt", event.target.value)}
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="flex items-center gap-2 text-sm text-zinc-300">
                <LinkIcon className="h-4 w-4" />
                Rulebook Link
              </span>
              <input
                required
                type="url"
                value={formData.rulebookLink}
                onChange={(event) =>
                  handleInputChange("rulebookLink", event.target.value)
                }
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="flex items-center gap-2 text-sm text-zinc-300">
                <LinkIcon className="h-4 w-4" />
                Poster Link
              </span>
              <input
                required
                type="url"
                value={formData.posterLink}
                onChange={(event) =>
                  handleInputChange("posterLink", event.target.value)
                }
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-zinc-300">Description</span>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(event) =>
                  handleInputChange("description", event.target.value)
                }
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </label>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            {(Object.keys(peopleLabels) as PeopleField[]).map((field) => (
              <div key={field} className="rounded-md border border-white/10 p-4">
                <h3 className="font-semibold text-amber-300">{peopleLabels[field]}</h3>
                <div className="mt-3 flex gap-2">
                  <input
                    value={lookupInputs[field]}
                    onChange={(event) =>
                      setLookupInputs((previous) => ({
                        ...previous,
                        [field]: event.target.value,
                      }))
                    }
                    placeholder="College ID"
                    className="min-w-0 flex-1 rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => addPerson(field)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
                    title={`Add ${peopleLabels[field]}`}
                  >
                    {lookupLoading === field ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {formData[field].length === 0 && (
                    <p className="text-sm text-zinc-500">No users added.</p>
                  )}
                  {formData[field].map((person) => (
                    <div
                      key={`${field}-${person.collegeID}`}
                      className="flex items-start justify-between gap-3 rounded-md bg-zinc-900 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {person.name}
                        </p>
                        <p className="truncate text-xs text-zinc-400">
                          {person.collegeID}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {person.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePerson(field, person.collegeID)}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-red-200"
                        title="Remove user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </form>
      </div>
    </main>
  );
}
