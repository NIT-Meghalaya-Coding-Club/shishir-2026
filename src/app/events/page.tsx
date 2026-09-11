"use client";
import React from "react";
import Image from "next/image";
import Inav from "@/components/events/internal-nav";
import { useEffect, useState } from "react";
import { CalendarDays, Crown, MapPin, Sparkles, X } from "lucide-react";
import Head from "next/head";

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
      <div className="flex flex-wrap gap-3">
        {people.map((person) => (
          <div key={`${label}-${person.name}`} className="flex items-center gap-2 rounded-full border border-yellow-400/20 bg-black/30 py-1 pl-1 pr-3">
            <Image
              src={person.image || fallbackProfileImage}
              alt=""
              width={30}
              height={30}
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="text-sm text-gray-100">{person.name}</span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="event-details-title" className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-yellow-400/40 bg-gray-950 shadow-2xl shadow-black/60" onMouseDown={(eventMouseDown) => eventMouseDown.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close event details" className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-2 text-yellow-300 transition hover:bg-yellow-400 hover:text-black">
          <X size={20} />
        </button>
        <div className="grid min-h-[55vh] md:grid-cols-[1fr_0.9fr]">
          <div className="order-2 flex flex-col gap-6 p-6 sm:p-8 md:order-1">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">{event.category.replace("_", " ")}</p>
              <h2 id="event-details-title" className="text-3xl font-bold text-white sm:text-4xl">{event.name}</h2>
            </div>
            <p className="leading-7 text-gray-300">{event.description}</p>
            <div className="grid gap-3 text-sm text-gray-200 sm:grid-cols-2">
              <p className="flex gap-2"><CalendarDays className="shrink-0 text-yellow-400" size={18} />{formatEventDate(event.startsAt)}</p>
              <p className="flex gap-2"><MapPin className="shrink-0 text-yellow-400" size={18} />{event.location}</p>
              <p><span className="text-yellow-400">Start:</span> {formatEventTime(event.startsAt)}</p>
              <p><span className="text-yellow-400">End:</span> {formatEventTime(event.endsAt)}</p>
            </div>
            <div className="space-y-4 border-t border-yellow-400/20 pt-5">
              <PeopleGroup label="Event Heads" people={event.eventHeads} />
              <PeopleGroup label="Coordinators" people={event.coordinators} />
              <PeopleGroup label="Co-coordinators" people={event.coCoordinators} />
            </div>
          </div>
          <div className="relative order-1 min-h-[280px] bg-black md:order-2 md:min-h-0">
            <Image src={event.posterLink} alt={`${event.name} poster`} fill className="object-contain" sizes="(max-width: 768px) 100vw, 45vw" />
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
        <link rel="preload" href="/img/brickwall.webp" as="image" />
      </Head>
      <div
        className="relative flex flex-col items-center w-full h-auto min-h-screen overflow-x-hidden pb-16"
        style={{ backgroundImage: `url('/img/brickwall.webp')` }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black-900/80 pointer-events-none" />

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

          <Inav />

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
                className="relative mx-4 sm:mx-6 md:mx-8 lg:mx-10 my-4 sm:my-6 md:my-8 lg:my-10 overflow-hidden"
              >
                {/* Outer rounded design with responsive border radius */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 animate-gradient-x 
    rounded-tl-[20px] rounded-br-[20px] 
    sm:rounded-tl-[25px] sm:rounded-br-[25px]
    md:rounded-tl-[30px] md:rounded-br-[30px]
    lg:rounded-tl-[40px] lg:rounded-br-[40px]"
                />

                <div
                  className="relative bg-gradient-to-r from-gray-900 to-black m-0.5 
    p-3 sm:p-4 md:p-5 lg:p-6
    rounded-tl-[18px] rounded-br-[18px]
    sm:rounded-tl-[23px] sm:rounded-br-[23px]
    md:rounded-tl-[28px] md:rounded-br-[28px]
    lg:rounded-tl-[38px] lg:rounded-br-[38px]"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-yellow-400" />

                    <h2
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold 
        text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600
        whitespace-nowrap"
                    >
                      {category.replace("_", " ")}
                    </h2>

                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Events Grid */}
              <div className="w-[90vw] mx-auto">
                <div className="flex flex-wrap justify-center gap-8">
                  {events
                    .filter((event) => event.category === category)
                    .map((event, index) => (
                    <div
                      key={event._id || event.code}
                      className="w-full max-w-[400px] aspect-square rounded-xl shadow-2xl relative overflow-hidden group transform transition-all duration-500 hover:scale-105"
                    >
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

                        {/* Event Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent text-white p-4 transform transition-transform duration-500 translate-y-full group-hover:translate-y-0 rounded-b-xl">
                          <p className="font-bold text-2xl text-yellow-400 mb-2">
                            {event.name}
                          </p>

                          {/* Links */}
                          <div className="flex flex-col gap-3">
                            <a
                              href={`/register/${event.code}`}
                              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 px-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
                            >
                              Register Now
                            </a>

                            <button
                                type="button"
                                onClick={() => setSelectedEvent(event)}
                                className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 text-yellow-400 border border-yellow-400/30 font-bold py-2 px-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/10"
                              >
                                View Event
                              </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </>
  );
}