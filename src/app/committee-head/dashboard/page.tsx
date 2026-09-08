"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  Edit3,
  Loader2,
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

type CommitteeRecord = {
  _id?: string;
  name: string;
  code: string;
  committeeHeads: Person[];
  coordinators: Person[];
  coCoordinators: Person[];
};

type PeopleField = "committeeHeads" | "coordinators" | "coCoordinators";

const emptyCommittee: CommitteeRecord = {
  name: "",
  code: "",
  committeeHeads: [],
  coordinators: [],
  coCoordinators: [],
};

const peopleLabels: Record<PeopleField, string> = {
  committeeHeads: "Committee Heads",
  coordinators: "Coordinators",
  coCoordinators: "Co-coordinators",
};

function getPersonCollegeIDs(people: Person[]) {
  return people.map((person) => person.collegeID).filter(Boolean);
}

export default function CommitteeHeadDashboard() {
  const { data: session, status } = useSession();
  const [committees, setCommittees] = useState<CommitteeRecord[]>([]);
  const [formData, setFormData] = useState<CommitteeRecord>(emptyCommittee);
  const [editingCode, setEditingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [lookupInputs, setLookupInputs] = useState<Record<PeopleField, string>>({
    committeeHeads: "",
    coordinators: "",
    coCoordinators: "",
  });
  const [lookupLoading, setLookupLoading] = useState<PeopleField | null>(null);

  const isEditing = Boolean(editingCode);

  const currentUserIsInHeads = useMemo(() => {
    if (!currentUser?.collegeID) return false;
    return formData.committeeHeads.some(
      (head) => head.collegeID === currentUser.collegeID
    );
  }, [currentUser, formData.committeeHeads]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const fetchInitialData = async () => {
      const userEmail = session.user?.email;
      const sessionName = session.user?.name || "";
      const sessionImage = session.user?.image || "";

      if (!userEmail) return;

      try {
        setLoading(true);

        const [userResponse, committeesResponse] = await Promise.all([
          fetch(`/api/user/get-info/${userEmail}`),
          fetch("/api/committees"),
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

        if (committeesResponse.ok) {
          const committeesData = await committeesResponse.json();
          setCommittees(committeesData.committees || []);
        } else {
          toast.error("Could not load your committees");
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
      committeeHeads: [currentUser, ...previous.committeeHeads],
    }));
  }, [currentUser, currentUserIsInHeads, isEditing]);

  const handleInputChange = (
    field: keyof Omit<CommitteeRecord, "committeeHeads" | "coordinators" | "coCoordinators">,
    value: string
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const resetForm = () => {
    setEditingCode("");
    setFormData({
      ...emptyCommittee,
      committeeHeads: currentUser?.collegeID ? [currentUser] : [],
    });
  };

  const editCommittee = (committee: CommitteeRecord) => {
    setEditingCode(committee.code);
    setFormData({
      ...committee,
      committeeHeads: committee.committeeHeads || [],
      coordinators: committee.coordinators || [],
      coCoordinators: committee .coCoordinators || [],
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
    if (field === "committeeHeads" && currentUser?.collegeID === collegeID) {
      toast.info("You must remain a committee head to edit this committee");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [field]: previous[field].filter((person) => person.collegeID !== collegeID),
    }));
  };

  const submitCommittee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUser?.collegeID) {
      toast.error("Complete your profile before creating committees");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...formData,
        committeeHeadCollegeIDs: getPersonCollegeIDs(formData.committeeHeads),
        coordinatorCollegeIDs: getPersonCollegeIDs(formData.coordinators),
        coCoordinatorCollegeIDs: getPersonCollegeIDs(formData.coCoordinators),
      };

      const response = await fetch(
        isEditing ? `/api/committees/${editingCode}` : "/api/committees",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Could not save committee");
        return;
      }

      const savedCommittee = data.committee;
      setCommittees((previous) => {
        const withoutSaved = previous.filter((item) => item.code !== editingCode);
        return [...withoutSaved, savedCommittee].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });
      setEditingCode(savedCommittee.code);
      setFormData(savedCommittee);
      toast.success(isEditing ? "Committee updated" : "Committee created");
    } catch (error) {
      console.error("Save committee failed:", error);
      toast.error("Could not save committee");
    } finally {
      setSaving(false);
    }
  };

  const deleteCommittee = async () => {
    if (!editingCode) return;

    const confirmed = window.confirm("Delete this committee?");
    if (!confirmed) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/committees/${editingCode}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Could not delete committee");
        return;
      }

      setCommittees((previous) =>
        previous.filter((committee) => committee.code !== editingCode)
      );
      resetForm();
      toast.success("Committee deleted");
    } catch (error) {
      console.error("Delete committee failed:", error);
      toast.error("Could not delete committee");
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
            Committee Head Dashboard
          </h1>
          <p className="mt-3 text-sm text-zinc-300">
            Sign in with your Google account to create and manage committees.
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/committee-head/dashboard" })}
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
                Committee Head Dashboard
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                {currentUser?.name || session?.user?.email}
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-amber-400 text-zinc-950 hover:bg-amber-300"
              title="Create committee"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {committees.length === 0 && (
              <p className="border border-white/10 bg-white/[0.04] p-4 text-sm text-zinc-300">
                No committees assigned to you yet.
              </p>
            )}
            {committees.map((committee) => (
              <button
                key={committee.code}
                type="button"
                onClick={() => editCommittee(committee)}
                className={`w-full rounded-md border p-4 text-left transition ${
                  editingCode === committee.code
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-white/10 bg-white/[0.04] hover:border-white/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-white">{committee.name}</h2>
                    <p className="mt-1 text-xs uppercase tracking-wide text-zinc-400">
                      {committee.code}
                    </p>
                  </div>
                  <Edit3 className="h-4 w-4 text-amber-300" />
                </div>
              </button>
            ))}
          </div>
        </aside>

        <form
          onSubmit={submitCommittee}
          className="space-y-6 border border-white/10 bg-white/[0.04] p-4 sm:p-6"
        >
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? "Edit Committee" : "Create Committee"}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Only Committee heads can update these details.
              </p>
            </div>
            <div className="flex gap-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={deleteCommittee}
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
              <span className="text-sm text-zinc-300">Committee Name</span>
              <input
                required
                value={formData.name}
                onChange={(committee) => handleInputChange("name", committee.target.value)}
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">Committee Code</span>
              <input
                required
                value={formData.code}
                onChange={(committee) => handleInputChange("code", committee.target.value)}
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
                    onChange={(committee) =>
                      setLookupInputs((previous) => ({
                        ...previous,
                        [field]: committee.target.value,
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
