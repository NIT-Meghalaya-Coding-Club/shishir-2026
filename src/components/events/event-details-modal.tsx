"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CalendarDays, Clock, ExternalLink, MapPin, Phone, X } from "lucide-react";

export type Person = {
  name: string;
  collegeID?: string;
  phone?: string;
  email?: string;
  image?: string;
};

export type EventRecord = {
  _id: string;
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

const fallbackProfileImage = "/assets/profile-icon.svg";

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatEventDuration(startsAt: string, endsAt: string) {
  const ms = new Date(endsAt).getTime() - new Date(startsAt).getTime();
  if (Number.isNaN(ms) || ms <= 0) return "";
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

// Stored user images are R2 keys / public URLs - map them to the profile
// proxy the same way the profile page does, otherwise avatars break.
function resolvePersonImage(image?: string) {
  if (!image) return fallbackProfileImage;
  if (image.startsWith("/api/uploads/profile/")) return image;
  try {
    const key = new URL(image).pathname.replace(/^\//, "");
    if (key.startsWith("profiles/")) return `/api/uploads/profile/${key}`;
    return image;
  } catch {
    if (image.startsWith("profiles/")) return `/api/uploads/profile/${image}`;
    return image;
  }
}

function PersonAvatar({ person }: { person: Person }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? fallbackProfileImage : resolvePersonImage(person.image);
  return (
    <Image
      src={src}
      alt={person.name}
      width={56}
      height={56}
      onError={() => setFailed(true)}
      className="h-14 w-14 shrink-0 rounded-full border-2 border-[#EE6C4D]/50 object-cover"
      unoptimized
    />
  );
}

function PeopleGroup({ label, people }: { label: string; people: Person[] }) {
  if (!people?.length) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#EE6C4D]">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {people.map((person) => (
          <div key={`${label}-${person.collegeID || person.email || person.name}`} className="flex min-w-0 items-center gap-3 rounded-lg border border-[#EE6C4D]/30 bg-[#3D5A80]/10 p-4 text-left">
            <PersonAvatar person={person} />
            <div className="flex min-w-0 flex-1 flex-col items-start space-y-1 text-sm">
              <p className="break-words font-semibold text-[#293241]">{person.name}</p>
              {person.collegeID && <p className="break-words text-[#3D5A80]">{(person.collegeID).toUpperCase()}</p>}
              {person.phone && (
                <a href={`tel:${person.phone}`} className="flex break-all items-center justify-start gap-1 text-[#EE6C4D] hover:text-[#EE6C4D]/80">
                  <Phone size={13} className="shrink-0" />
                  {person.phone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventDetailsModal({ event, onClose }: { event: EventRecord; onClose: () => void }) {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };

    // Lock background scroll via CSS
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    // Attach at document level (non-passive) so every wheel event anywhere
    // on the page is caught. preventDefault() stops the page from scrolling;
    // scrollTop assignment drives the left column instead.
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollableRef.current) {
        scrollableRef.current.scrollTop += e.deltaY;
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [onClose]);

  const duration = formatEventDuration(event.startsAt, event.endsAt);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-30 flex items-center justify-center bg-[#293241]/60 p-4 sm:p-8 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-details-title"
        className="relative flex mt-10 h-[85vh] max-h-[800px] w-[85vh] max-w-[760px] flex-col rounded-3xl border border-[#98C1D9]/50 bg-[#E0FBFC] shadow-2xl"
        onMouseDown={(eventMouseDown) => eventMouseDown.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close event details"
          className="absolute -right-3 -top-3 z-50 flex items-center justify-center h-10 w-10 rounded-full bg-[#3D5A80] border-2 border-[#3D5A80] text-[#E0FBFC] shadow-xl transition-all duration-200 hover:scale-110 hover:bg-[#EE6C4D] hover:border-[#EE6C4D] hover:text-[#E0FBFC]"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Single scroll flow: details -> schedule -> poster -> actions -> people */}
        <div ref={scrollableRef} className="flex flex-col gap-6 overflow-y-auto overscroll-contain hide-scrollbar p-5 pb-8 sm:p-8 md:p-10">
          {/* Event details */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#EE6C4D]">{event.category.replace("_", " ")}</p>
            <h2 id="event-details-title" className="text-3xl sm:text-4xl font-serif font-bold text-[#293241] mb-4">{event.name}</h2>
            <p className="whitespace-pre-wrap break-words leading-relaxed text-[#3D5A80] text-sm">{event.description}</p>
          </div>

          {/* Schedule: date + venue pills, then start -> end timeline */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#EE6C4D]/30 bg-[#EE6C4D]/10 px-3 py-1.5 font-semibold text-[#293241]">
                <CalendarDays className="shrink-0 text-[#EE6C4D]" size={16} />
                {formatEventDate(event.startsAt)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#EE6C4D]/30 bg-[#EE6C4D]/10 px-3 py-1.5 font-semibold text-[#293241]">
                <MapPin className="shrink-0 text-[#EE6C4D]" size={16} />
                {event.location}
              </span>
            </div>

            {/* Timeline: mobile = Start/End on top row, bar on its own row. sm+ = single row. */}
            <div className="rounded-2xl border border-[#EE6C4D]/30 bg-[#3D5A80]/10 p-4 sm:p-5">
              <div className="grid grid-cols-2 items-center gap-x-4 gap-y-4 sm:grid-cols-[auto_1fr_auto] sm:gap-x-5">
                {/* Start */}
                <div className="order-1 text-left sm:text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EE6C4D]">Start</p>
                  <p className="whitespace-nowrap text-lg font-bold text-[#293241] sm:text-base">
                    {formatEventTime(event.startsAt)}
                  </p>
                </div>

                {/* End */}
                <div className="order-2 text-right sm:order-3 sm:text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EE6C4D]">End</p>
                  <p className="whitespace-nowrap text-lg font-bold text-[#293241] sm:text-base">
                    {formatEventTime(event.endsAt)}
                  </p>
                </div>

                {/* Bar: full-width row on mobile, middle column on sm+ */}
                <div className="order-3 col-span-2 flex min-w-0 items-center gap-2 sm:order-2 sm:col-span-1">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#EE6C4D]" />
                  <div className="h-[2px] min-w-2 flex-1 rounded-full bg-gradient-to-r from-[#EE6C4D] via-[#98C1D9] to-[#EE6C4D]" />
                  {duration && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#EE6C4D]/15 px-3 py-1 text-xs font-bold text-[#EE6C4D]">
                      <Clock size={12} />
                      {duration}
                    </span>
                  )}
                  <div className="h-[2px] min-w-2 flex-1 rounded-full bg-gradient-to-r from-[#EE6C4D] via-[#98C1D9] to-[#EE6C4D]" />
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#EE6C4D]" />
                </div>
              </div>
            </div>
          </div>

          {/* Poster */}
          <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-2xl bg-black/5 sm:h-80 md:h-96">
            <Image src={event.posterLink} alt={`${event.name} poster`} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 760px" />
          </div>

          {/* Actions: stacked, full width, 56px+ tall on mobile; side by side on sm+ */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href={event.rulebookLink}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full border border-[#98C1D9]/60 bg-[#98C1D9]/20 px-6 py-3 text-base font-bold uppercase tracking-wide text-[#293241] shadow-sm transition-colors hover:bg-[#98C1D9]/40 active:scale-[0.98] sm:min-h-12 sm:text-sm"
            >
              <ExternalLink size={18} />
              View Rulebook
            </a>

            <a
              href={`/register/${event.code}`}
              className="flex min-h-14 flex-1 items-center justify-center rounded-full bg-[#EE6C4D] px-6 py-3 text-base font-bold uppercase tracking-wide text-[#E0FBFC] transition-all hover:bg-[#EE6C4D]/90 hover:shadow-lg hover:shadow-[#EE6C4D]/25 active:scale-[0.98] sm:min-h-12 sm:text-sm"
            >
              Register Now
            </a>
          </div>

          {/* People */}
          <div className="space-y-4 border-t border-[#3D5A80]/20 pt-6">
            <PeopleGroup label="Event Heads" people={event.eventHeads} />
            <PeopleGroup label="Coordinators" people={event.coordinators} />
            <PeopleGroup label="Co-coordinators" people={event.coCoordinators} />
          </div>
        </div>
      </div>
    </div>
  );
}
