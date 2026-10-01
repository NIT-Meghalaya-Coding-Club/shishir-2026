"use client";
import React from "react";
import Image from "next/image";
import Inav from "@/components/events/internal-nav";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, Crown, ExternalLink, Mail, MapPin, Phone, Sparkles, X } from "lucide-react";
import Head from "next/head";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#EE6C4D]">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {people.map((person) => (
          <div key={`${label}-${person.collegeID || person.email || person.name}`} className="flex flex-col min-w-0 items-center justify-center gap-3 rounded-lg border border-[#EE6C4D]/30 bg-[#3D5A80]/10 dark:bg-[#3D5A80]/30 p-4 text-center">
            <Image
              src={person.image || fallbackProfileImage}
              alt=""
              width={56}
              height={56}
              className="my-2 h-14 w-14 rounded-full border-2 border-[#EE6C4D]/50 object-cover"
            />
            <div className="flex flex-col items-center min-w-0 space-y-1 text-sm">
              <p className="break-words font-semibold text-[#293241] dark:text-[#E0FBFC]">{person.name}</p>
              {person.collegeID && <p className="break-words text-[#3D5A80] dark:text-[#98C1D9]">Roll no: {person.collegeID}</p>}
              {person.phone && (
                <a href={`tel:${person.phone}`} className="flex break-all items-center justify-center gap-1 text-[#EE6C4D] hover:text-[#EE6C4D]/80">
                  <Phone size={13} />
                  {person.phone}
                </a>
              )}
              {person.email && (
                <a href={`mailto:${person.email}`} className="flex break-all items-start justify-center gap-1 text-[#EE6C4D] hover:text-[#EE6C4D]/80">
                  <Mail size={13} className="mt-[4px] shrink-0" />
                  <span>{person.email}</span>
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

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center bg-[#293241]/60 dark:bg-[#293241]/80 p-4 sm:p-8 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-details-title"
        className="relative h-[85vh] max-h-[800px] w-full max-w-[1000px] rounded-3xl border border-[#98C1D9]/50 dark:border-[#3D5A80]/50 bg-[#E0FBFC] dark:bg-[#293241] shadow-2xl flex flex-col md:flex-row md:gap-4 overflow-visible"
        onMouseDown={(eventMouseDown) => eventMouseDown.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close event details"
          className="absolute -right-3 -top-3 z-30 flex items-center justify-center h-10 w-10 rounded-full bg-[#3D5A80] border-2 border-[#3D5A80] text-[#E0FBFC] shadow-xl transition-all duration-200 hover:scale-110 hover:bg-[#EE6C4D] hover:border-[#EE6C4D] hover:text-[#E0FBFC]"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Left Column (Strictly Scrollable Details) */}
        <div className="flex-1 relative min-h-[40vh] md:min-h-0 rounded-l-3xl">
          <div ref={scrollableRef} className="absolute inset-0 p-6 sm:p-8 md:p-10 overflow-y-auto overscroll-contain hide-scrollbar flex flex-col">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#EE6C4D]">{event.category.replace("_", " ")}</p>
            <h2 id="event-details-title" className="text-3xl sm:text-4xl font-serif font-bold text-[#293241] dark:text-[#E0FBFC] mb-4">{event.name}</h2>
            <p className="whitespace-pre-wrap break-words leading-relaxed text-[#3D5A80] dark:text-[#98C1D9] text-sm mb-6 shrink-0">{event.description}</p>

            <div className="grid gap-3 text-sm text-[#293241] dark:text-[#E0FBFC] sm:grid-cols-2 mb-6 pb-6 border-b border-[#3D5A80]/20 dark:border-[#98C1D9]/20 shrink-0">
              <p className="flex items-center gap-2"><CalendarDays className="shrink-0 text-[#EE6C4D]" size={16} />{formatEventDate(event.startsAt)}</p>
              <p className="flex items-center gap-2"><MapPin className="shrink-0 text-[#EE6C4D]" size={16} />{event.location}</p>
              <p className="flex items-center gap-2"><span className="text-[#EE6C4D] font-semibold">Start:</span> {formatEventTime(event.startsAt)}</p>
              <p className="flex items-center gap-2"><span className="text-[#EE6C4D] font-semibold">End:</span> {formatEventTime(event.endsAt)}</p>
            </div>

            <div className="space-y-4 shrink-0 pb-4">
              <PeopleGroup label="Event Heads" people={event.eventHeads} />
              <PeopleGroup label="Coordinators" people={event.coordinators} />
              <PeopleGroup label="Co-coordinators" people={event.coCoordinators} />
            </div>
          </div>
        </div>

        {/* Right Column (Image & Buttons) */}
        <div className="flex flex-col md:w-[45%] shrink-0 p-6 sm:p-8 md:pl-4 border-t md:border-t-0 md:border-l border-[#98C1D9]/50 dark:border-[#3D5A80]/50 h-full overflow-y-auto custom-scrollbar md:overflow-hidden">
          <div className="relative w-full rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 flex-1 min-h-[250px] md:min-h-[300px] mb-6">
            <Image src={event.posterLink} alt={`${event.name} poster`} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 45vw" />
          </div>

          {/* Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <a
              href={event.rulebookLink}
              target="_blank"
              rel="noreferrer"
              className="btn-53 flex flex-1 items-center justify-center rounded-full border border-[#98C1D9]/50 dark:border-[#3D5A80]/50 bg-[#98C1D9]/20 dark:bg-[#3D5A80]/20 px-2 h-14 text-center font-semibold text-[#293241] dark:text-[#E0FBFC] transition hover:bg-[#98C1D9]/40 dark:hover:bg-[#3D5A80]/40 shadow-sm"
            >
              <div className="original flex items-center justify-center gap-2 text-[13px] sm:text-sm">
                <ExternalLink size={16} /> VIEW RULEBOOK
              </div>
              <div className="letters text-[13px] sm:text-sm">
                {"VIEW RULEBOOK".split("").map((char, index) => (
                  <span key={index} style={{ transitionDelay: `${index * 0.03}s` }}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
            </a>
            <a
              href={`/register/${event.code}`}
              className="btn-53 flex flex-1 items-center justify-center rounded-full bg-[#EE6C4D] hover:bg-[#EE6C4D]/90 text-[#E0FBFC] px-2 h-14 text-center font-bold transition hover:shadow-lg hover:shadow-[#EE6C4D]/25"
            >
              <div className="original text-[13px] sm:text-sm">REGISTER NOW</div>
              <div className="letters text-[13px] sm:text-sm">
                {"REGISTER NOW".split("").map((char, index) => (
                  <span key={index} style={{ transitionDelay: `${index * 0.03}s` }}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
            </a>
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
        <div className="absolute inset-0 bg-[#E0FBFC]/80 dark:bg-[#293241]/80 pointer-events-none transition-colors duration-300" />

        {/* Content container */}
        <div className="relative w-full">
          {/* Header Section */}
          <div className="text-center mt-20 mb-12">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Crown className="w-12 h-12 text-[#EE6C4D] animate-pulse" />
              <h1 className="text-6xl font-bold text-[#293241] dark:text-[#E0FBFC] drop-shadow-sm pt-10">
                EVENTS
              </h1>
              <Crown className="w-12 h-12 text-[#EE6C4D] animate-pulse" />
            </div>
            <div className="h-1 w-48 mx-auto bg-[#EE6C4D] rounded-full" />
          </div>

          <Inav categories={eventCategories} />

          {loading && <p className="text-center text-[#EE6C4D] text-xl">Loading events...</p>}
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
                <div className="relative group flex items-center justify-center cursor-default rounded-full transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#EE6C4D] hover:scale-[1.03]">

                  {/* Soft Background Layer */}
                  <div className="absolute inset-0 bg-[#E0FBFC]/70 dark:bg-[#3D5A80]/40 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.03)] transition-transform duration-300" />

                  {/* Border Layer */}
                  <div className="absolute inset-0 border border-[#98C1D9]/60 dark:border-[#3D5A80]/50 rounded-full" />

                  {/* Content */}
                  <div className="relative px-10 sm:px-20 py-4 sm:py-6 flex items-center justify-center gap-4 sm:gap-8 z-10">
                    <div className="h-[2px] w-6 sm:w-12 bg-[#EE6C4D] rounded-full opacity-80" />

                    <h2
                      className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#293241] dark:text-[#E0FBFC] uppercase tracking-widest whitespace-nowrap drop-shadow-sm"
                    >
                      {category.replace("_", " ")}
                    </h2>

                    <div className="h-[2px] w-6 sm:w-12 bg-[#EE6C4D] rounded-full opacity-80" />
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
                  navigation={events.filter((event) => event.category === category).length > 1}
                  modules={[EffectCoverflow, Pagination, Navigation]}
                  className="w-full pb-24 pt-12 !overflow-visible"
                  style={{
                    "--swiper-pagination-bottom": "0px",
                    "--swiper-pagination-color": "#EE6C4D",
                    "--swiper-pagination-bullet-inactive-color": "#3D5A80",
                    "--swiper-navigation-color": "#EE6C4D",
                    "--swiper-navigation-size": "28px",
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
                          <div className="absolute inset-0 bg-[#EE6C4D] animate-gradient-x rounded-tl-[20px] rounded-br-[20px]" />

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
                                  className="w-full bg-[#EE6C4D]/90 hover:bg-[#EE6C4D] text-slate-900 font-extrabold uppercase tracking-widest drop-shadow-sm py-2.5 px-4 rounded-full text-center backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
                                >
                                  Register Now
                                </a>

                                <button
                                  type="button"
                                  onClick={() => setSelectedEvent(event)}
                                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-extrabold uppercase tracking-widest drop-shadow-sm py-2.5 px-4 rounded-full text-center backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
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
      </div >
      {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      }
    </>
  );
}