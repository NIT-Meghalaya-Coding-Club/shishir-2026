"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";

import Inav from "@/components/events/internal-nav";
import EventDetailsModal, {
  type EventRecord,
} from "@/components/events/event-details-modal";
import PageHeading from "@/components/PageHeading";
import Blossom from "@/components/Blossom";
import PageLoader from "@/components/ui/page-loader";

/* -------------------------------------------------------------------------- */
/*  Carousel for one category                                                 */
/* -------------------------------------------------------------------------- */

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

function CategoryCarousel({
  events,
  onView,
}: {
  events: EventRecord[];
  onView: (event: EventRecord) => void;
}) {
  const total = events.length;
  const startIndex = Math.floor((total - 1) / 2); // start in the middle so both sides look balanced
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(startIndex);
  const showControls = total > 1;
  const showDots = total <= 8;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Swiper
        effect="coverflow"
        modules={[EffectCoverflow, Mousewheel]}
        centeredSlides
        slidesPerView="auto"
        spaceBetween={16}
        initialSlide={startIndex}
        grabCursor={total > 1}
        threshold={15}
        noSwiping={true}
        noSwipingClass="swiper-no-swiping"
        mousewheel={{ forceToAxis: true, releaseOnEdges: true, sensitivity: 1 }}
        watchSlidesProgress
        coverflowEffect={{
          rotate: 28,
          stretch: 0,
          depth: 140,
          modifier: 1,
          slideShadows: false,
        }}
        slideToClickedSlide
        onClick={(s) => {
          if (typeof s.clickedIndex === "number" && s.clickedIndex !== s.activeIndex) {
            s.slideTo(s.clickedIndex);
          }
        }}
        onSwiper={setSwiper}
        onSlideChange={(s) => setActive(s.activeIndex)}
        onActiveIndexChange={(s) => setActive(s.activeIndex)}
        className="w-full !px-2 !py-8"
      >
        {events.map((event, index) => {
          const isCurrent = index === active;
          return (
            <SwiperSlide
              key={event._id || event.code}
              onClick={() => {
                if (swiper && swiper.activeIndex !== index) {
                  swiper.slideTo(index);
                }
              }}
              style={{ cursor: !isCurrent ? "pointer" : undefined }}
              className={`!h-auto !w-[72vw] max-w-[320px] sm:max-w-[340px] md:max-w-[360px] transition-opacity duration-300 ${
                isCurrent
                  ? "opacity-100"
                  : "swiper-no-swiping opacity-50 !cursor-pointer"
              }`}
            >
              <div
                style={{ cursor: !isCurrent ? "pointer" : undefined }}
                className={`group pointer-events-none relative aspect-square [.swiper-slide-active_&]:pointer-events-auto w-full overflow-hidden rounded-xl rounded-tl-[20px] rounded-br-[20px] bg-[#EE6C4D] p-0.5 shadow-[0_12px_32px_-12px_rgba(41,50,65,0.6)] ${
                  !isCurrent ? "!cursor-pointer" : ""
                }`}
              >
              <div className="relative h-full w-full overflow-hidden rounded-[10px] rounded-tl-[18px] rounded-br-[18px] bg-gradient-to-br from-gray-900 to-black">
                <Image
                  src={event.posterLink}
                  alt={event.name}
                  fill
                  sizes="(max-width: 640px) 72vw, 360px"
                  quality={75}
                  priority={index < 3}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />

                {/* Name + actions: compact responsive layout, shown only on active slide on touch screens */}
                <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col gap-1.5 sm:gap-2.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-3 pb-3 pt-8 sm:px-4 sm:pb-4 sm:pt-14 transition-transform duration-500 group-hover:translate-y-0 group-focus-within:translate-y-0 [.swiper-slide-active_&]:[@media(hover:none)]:translate-y-0">
                  <p className="line-clamp-1 sm:line-clamp-2 text-sm sm:text-base font-extrabold uppercase leading-tight tracking-wider text-white drop-shadow-sm md:text-xl">
                    {event.name}
                  </p>

                  <div className="flex w-full items-center gap-2">
                    <a
                      href={`/register/${event.code}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 rounded-full bg-[#EE6C4D] py-1.5 px-2.5 text-center text-xs sm:py-2 sm:text-sm font-extrabold uppercase tracking-wider text-slate-950 shadow-sm transition-all duration-200 hover:bg-[#ff7e5f] active:scale-95"
                    >
                      <span className="sm:hidden">Register</span>
                      <span className="hidden sm:inline">Register Now</span>
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(event);
                      }}
                      className="flex-1 rounded-full border border-white/40 bg-white/20 py-1.5 px-2.5 text-center text-xs sm:py-2 sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/30 active:scale-95"
                    >
                      <span className="sm:hidden">View</span>
                      <span className="hidden sm:inline">View Event</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Controls: always visible, below the slides, never covered by cards */}
      {showControls && (
        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous event"
            onClick={() => swiper?.slidePrev()}
            disabled={active === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#293241] text-[#E0FBFC] shadow-md transition hover:bg-[#EE6C4D] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#293241] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EE6C4D]"
          >
            <ChevronIcon direction="left" />
          </button>

          {showDots ? (
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose event">
              {events.map((event, i) => (
                <button
                  key={event._id || event.code}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Go to ${event.name}`}
                  onClick={() => swiper?.slideTo(i)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-8 bg-[#EE6C4D]"
                      : "w-3 bg-[#3D5A80]/40 hover:bg-[#3D5A80]"
                  }`}
                />
              ))}
            </div>
          ) : (
            <span className="min-w-[4.5rem] text-center text-sm font-bold tabular-nums text-[#293241]">
              {active + 1} / {total}
            </span>
          )}

          <button
            type="button"
            aria-label="Next event"
            onClick={() => swiper?.slideNext()}
            disabled={active === total - 1}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#293241] text-[#E0FBFC] shadow-md transition hover:bg-[#EE6C4D] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#293241] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EE6C4D]"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function getCategoryRank(category?: string): number {
  if (!category) return 3;
  const lower = category.toLowerCase().trim();
  if (lower.includes("dance")) return 0;
  if (lower.includes("gaming") || /\bgames?\b/i.test(lower)) return 1;
  if (lower.includes("music")) return 2;
  return 3;
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
        const loadedEvents: EventRecord[] = Array.isArray(data.events)
          ? [...data.events].sort((a, b) => {
              const rankA = getCategoryRank(a.category);
              const rankB = getCategoryRank(b.category);
              if (rankA !== rankB) return rankA - rankB;
              return 0;
            })
          : [];
        setEvents(loadedEvents);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error ? fetchError.message : "Unable to load events"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Group once instead of filtering on every render
  const grouped = useMemo(() => {
    const map = new Map<string, EventRecord[]>();
    events.forEach((event) => {
      const list = map.get(event.category) ?? [];
      list.push(event);
      map.set(event.category, list);
    });
    return map;
  }, [events]);

  const eventCategories = useMemo(
    () =>
      Array.from(grouped.keys()).sort((a, b) => {
        const rankA = getCategoryRank(a);
        const rankB = getCategoryRank(b);
        if (rankA !== rankB) return rankA - rankB;
        return a.localeCompare(b, undefined, { sensitivity: "base", numeric: true });
      }),
    [grouped]
  );

  return (
    <>
      <div
        className="relative flex min-h-screen w-full flex-col items-center overflow-x-hidden pb-16"
        style={{
          backgroundImage: `url('/img/pattern-floral.png')`,
          backgroundSize: "700px",
          backgroundRepeat: "repeat",
        }}
      >
        {/* Tint over the pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[#E0FBFC]/85" />

        <div className="relative w-full">
          <PageHeading title="Events" />

          <Inav categories={eventCategories} />

          {loading && (
            <PageLoader active />
          )}
          {!loading && error && (
            <p className="py-10 text-center text-xl text-red-500">{error}</p>
          )}
          {!loading && !error && eventCategories.length === 0 && (
            <p className="py-10 text-center text-xl text-[#3D5A80]">
              No events available.
            </p>
          )}

          {!loading &&
            !error &&
            eventCategories.map((category) => (
              <section
                key={category}
                id={category.toLowerCase().replace(/ /g, "-")}
                className="scroll-mt-24 py-8 sm:py-12"
              >
                {/* Category heading */}
                <div className="mx-4 mb-4 flex justify-center sm:mx-8">
                  <div className="flex max-w-full items-center gap-2 rounded-full border border-[#98C1D9]/70 bg-[#E0FBFC]/80 px-4 py-2 shadow-sm backdrop-blur-md sm:gap-4 sm:px-8 sm:py-3">
                    <Blossom className="h-6 w-6 shrink-0 animate-spin text-[#EE6C4D] [animation-duration:3s] sm:h-9 sm:w-9" />
                    <h2 className="truncate text-lg font-extrabold uppercase tracking-widest text-[#293241] sm:text-3xl md:text-4xl">
                      {category.replace(/_/g, " ")}
                    </h2>
                    <Blossom className="h-6 w-6 shrink-0 animate-spin text-[#EE6C4D] [animation-duration:3s] sm:h-9 sm:w-9" />
                  </div>
                </div>

                <CategoryCarousel
                  events={grouped.get(category) ?? []}
                  onView={setSelectedEvent}
                />
              </section>
            ))}
        </div>
      </div>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}