"use client";
import React from "react";
import Image from "next/image";
import Inav from "@/components/events/internal-nav";
import { useEffect, useState } from "react";
import { CalendarDays, Crown, ExternalLink, Mail, MapPin, Phone, Sparkles, X } from "lucide-react";
import Head from "next/head";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

type EventRecord = {
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

type Person = {
  name: string;
  collegeID?: string;
  phone?: string;
  email?: string;
  image?: string;
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

function PeopleGroup({ label, people }: { label: string; people: Person[] }) {
  if (!people?.length) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {people.map((person) => (
          <div key={`${label}-${person.collegeID || person.email || person.name}`} className="flex min-w-0 items-start gap-3 rounded-lg border border-yellow-400/20 bg-black/30 p-3">
            <Image
              src={person.image || fallbackProfileImage}
              alt=""
              width={30}
              height={30}
              className="h-7 w-7 rounded-full object-cover"
            />
            <div className="min-w-0 space-y-1 text-sm">
              <p className="break-words font-semibold text-gray-100">{person.name}</p>
              {person.collegeID && <p className="break-words text-gray-400">Roll no: {person.collegeID}</p>}
              {person.phone && (
                <a href={`tel:${person.phone}`} className="flex break-all items-center gap-1 text-yellow-300 hover:text-yellow-200">
                  <Phone size={13} />
                  {person.phone}
                </a>
              )}
              {person.email && (
                <a href={`mailto:${person.email}`} className="flex break-all items-center gap-1 text-yellow-300 hover:text-yellow-200">
                  <Mail size={13} />
                  {person.email}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventDetailsModal({ event, onClose }: { event: EventRecord; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="event-details-title" className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-yellow-500/40 bg-white dark:bg-gray-950 shadow-2xl" onMouseDown={(eventMouseDown) => eventMouseDown.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close event details" className="sticky left-4 top-4 z-20 -mb-10 mr-auto block rounded-full bg-slate-100 dark:bg-black/70 p-2 text-yellow-600 dark:text-yellow-300 transition hover:bg-yellow-400 hover:text-black">
          <X size={20} />
        </button>
        <div className="grid min-h-[55vh] md:grid-cols-[1fr_0.9fr]">
          <div className="order-2 flex flex-col gap-6 p-6 sm:p-8 md:order-1">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-400">{event.category.replace("_", " ")}</p>
              <h2 id="event-details-title" className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{event.name}</h2>
            </div>
            <p className="whitespace-pre-wrap break-words leading-7 text-slate-700 dark:text-gray-300">{event.description}</p>
            <div className="grid gap-3 text-sm text-slate-800 dark:text-gray-200 sm:grid-cols-2">
              <p className="flex gap-2"><CalendarDays className="shrink-0 text-yellow-500" size={18} />{formatEventDate(event.startsAt)}</p>
              <p className="flex gap-2"><MapPin className="shrink-0 text-yellow-500" size={18} />{event.location}</p>
              <p><span className="text-yellow-600 dark:text-yellow-400 font-semibold">Start:</span> {formatEventTime(event.startsAt)}</p>
              <p><span className="text-yellow-600 dark:text-yellow-400 font-semibold">End:</span> {formatEventTime(event.endsAt)}</p>
            </div>
            <div className="space-y-4 border-t border-yellow-400/20 pt-5">
              <PeopleGroup label="Event Heads" people={event.eventHeads} />
              <PeopleGroup label="Coordinators" people={event.coordinators} />
              <PeopleGroup label="Co-coordinators" people={event.coCoordinators} />
            </div>
            <div className="mt-auto flex flex-col gap-3 border-t border-yellow-400/20 pt-5 sm:flex-row">
              <a
                href={event.rulebookLink}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-yellow-400/40 px-4 py-3 text-center font-semibold text-yellow-300 transition hover:bg-yellow-400/10"
              >
                <ExternalLink size={18} />
                View Rulebook
              </a>
              <a
                href={`/register/${event.code}`}
                className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-3 text-center font-bold text-black transition hover:shadow-lg hover:shadow-yellow-500/25"
              >
                Register Now
              </a>
            </div>
          </div>
          <div className="relative order-1 flex min-h-[280px] items-center justify-center bg-black md:order-2 md:min-h-0">
            <Image src={event.posterLink} alt={`${event.name} poster`} fill className="object-contain object-center" sizes="(max-width: 768px) 100vw, 45vw" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {

        const response = await fetch("/api/events");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load events");
        }

        setEvents(data.events);

      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const eventCategories = Array.from(new Set(events.map((event) => event.category)));

  return (
    <>
      <Head>
        <link rel="preload" href="/img/pattern-floral.png" as="image" />
      </Head>
      <div
        className="relative flex flex-col items-center w-full h-auto min-h-screen overflow-x-hidden pb-16"
        style={{
          backgroundImage: `url('/img/pattern-floral.png')`,
          backgroundSize: '700px',
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 backdrop-invert bg-gradient-to-br from-white/95 via-slate-100/90 to-white/95 dark:from-gray-900/80 dark:to-black/80 pointer-events-none transition-colors duration-300" />

        {/* Content container */}
        <div className="relative w-full">
          {/* Header Section */}
          <div className="text-center mt-20 mb-12">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 pt-10">
                EVENTS
              </h1>
              <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
            </div>
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
          </div>

          <Inav categories={eventCategories} />

          {loading && <p className="text-center text-yellow-400 text-xl">Loading events...</p>}
          {!loading && error && <p className="text-center text-red-300 text-xl">{error}</p>}
          {!loading && !error && eventCategories.length === 0 && (
            <p className="text-center text-gray-300 text-xl">No events available.</p>
          )}

          {!loading && !error && eventCategories.map((category) => (
            <React.Fragment key={category}>
              {/* Category Header */}
              <div
                id={category.toLowerCase().replace(/ /g, "-")}
                className="relative flex flex-col items-center justify-center mx-4 sm:mx-6 md:mx-8 lg:mx-10 my-12 sm:my-16"
              >
                {/* Soft, Elegant Glassmorphic Design */}
                <div className="relative group flex items-center justify-center cursor-default">

                  {/* Soft Background Layer */}
                  <div className="absolute inset-0 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.03)] transition-transform duration-500 group-hover:scale-[1.02]" />

                  {/* Border Layer */}
                  <div className="absolute inset-0 border border-slate-200/60 dark:border-white/10 rounded-full" />

                  {/* Content */}
                  <div className="relative px-10 sm:px-20 py-4 sm:py-6 flex items-center justify-center gap-4 sm:gap-8 z-10">
                    <div className="h-[2px] w-6 sm:w-12 bg-amber-400 rounded-full opacity-80" />

                    <h2
                      className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-widest whitespace-nowrap drop-shadow-sm"
                    >
                      {category.replace("_", " ")}
                    </h2>

                    <div className="h-[2px] w-6 sm:w-12 bg-amber-400 rounded-full opacity-80" />
                  </div>
                </div>
              </div>

              {/* Events Swiper */}
              <div className="w-[90vw] mx-auto">
                <Swiper
                  effect={'coverflow'}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={'auto'}
                  initialSlide={1}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                  }}
                  pagination={{ clickable: true }}
                  modules={[EffectCoverflow, Pagination]}
                  className="w-full pb-24 pt-12 !overflow-visible"
                  style={{
                    "--swiper-pagination-bottom": "0px",
                    "--swiper-pagination-color": "#facc15",
                    "--swiper-pagination-bullet-inactive-color": "#475569",
                  } as React.CSSProperties}
                >
                  {events
                    .filter((event) => event.category === category)
                    .map((event, index) => (
                      <SwiperSlide
                        key={event._id || event.code}
                        className="!w-[280px] sm:!w-[340px] md:!w-[400px] aspect-square !overflow-visible"
                      >
                        <div className="w-full h-full rounded-xl shadow-2xl relative overflow-hidden group transform transition-all duration-500 hover:scale-105">
                          {/* Decorative border */}
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-gradient-x rounded-tl-[20px] rounded-br-[20px]" />

                          {/* Content container */}
                          <div className="absolute inset-0.5 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-tl-[18px] rounded-br-[18px]">
                            {/* Image */}
                            <Image
                              src={event.posterLink}
                              alt={event.name}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              quality={75}
                              priority={index < 4}
                              className="transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Event Name Overlay (Gradient) */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-16 pb-5 px-5 transform transition-transform duration-500 translate-y-full group-hover:translate-y-0 rounded-b-xl flex flex-col gap-4">
                              <p className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-widest whitespace-nowrap drop-shadow-sm truncate">
                                {event.name}
                              </p>

                              {/* Links */}
                              <div className="flex flex-col gap-2.5">
                                <a
                                  href={`/register/${event.code}`}
                                  className="w-full bg-amber-400/90 hover:bg-amber-400 text-slate-900 font-extrabold uppercase tracking-widest drop-shadow-sm py-2.5 px-4 rounded-xl text-center backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
                                >
                                  Register Now
                                </a>

                                <button
                                  type="button"
                                  onClick={() => setSelectedEvent(event)}
                                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-extrabold uppercase tracking-widest drop-shadow-sm py-2.5 px-4 rounded-xl text-center backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
                                >
                                  View Event
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </>
  );
}