"use client";

import React, { useState } from "react";
import { Schedule, EventType } from "@/data/schedule";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
} from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

import PageHeading from "@/components/PageHeading";

/* ──────────────────────────────────────────────────────────────
   Palette
   Dusk Blue #3D5A80 · Powder Blue #98C1D9 · Burnt Peach #EE6C4D
   Light Cyan #E0FBFC · Jet Black #293241
   ────────────────────────────────────────────────────────────── */

const PETAL_COLORS = ["#F9C9C4", "#F4A9A0", "#EE6C4D", "#FBDDD9", "#F6B7B0"];

const paperGrain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.24  0 0 0 0 0.35  0 0 0 0 0.5  0 0 0 0.09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const paperCls =
  "bg-gradient-to-br from-white via-[#F3FCFC] to-[#DDF1F5] dark:from-[#3b4d6b] dark:via-[#33435e] dark:to-[#2c3a52]";

function Blossom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6.2"
          rx="3.6"
          ry="5"
          fill="currentColor"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2" fill="#E0FBFC" />
      <circle cx="12" cy="12" r="0.9" fill="#EE6C4D" />
    </svg>
  );
}

/** Grain + peach mounting lines shared by every paper panel */
function PaperDressing({ strong = true }: { strong?: boolean }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40 mix-blend-multiply"
        style={{ backgroundImage: paperGrain }}
      />
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-[#EE6C4D] ${
          strong ? "" : "opacity-40"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#EE6C4D] ${
          strong ? "" : "opacity-40"
        }`}
      />
    </>
  );
}

const SchedulePage = () => {
  const days = Object.keys(Schedule);
  const [activeDay, setActiveDay] = useState(days[0]);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = Object.keys(Schedule[activeDay]);

  const sortEventsByTime = (events: EventType[]) => {
    return [...events].sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
      const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
      return timeA - timeB;
    });
  };

  const allEvents = Object.values(Schedule[activeDay]).flat();
  const sortedAllEvents = sortEventsByTime(allEvents);

  const categoryEvents =
    activeCategory === "All"
      ? sortedAllEvents
      : sortEventsByTime(Schedule[activeDay][activeCategory]);

  if (process.env.NEXT_PUBLIC_LAUNCH) {
    return (
      <ComingSoon />
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#E0FBFC] dark:bg-[#293241]">
      {/* Backdrop: soft glows and drifting petals */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-[#98C1D9]/40 blur-3xl dark:bg-[#3D5A80]/40" />
        <div className="absolute -bottom-32 -right-24 h-[26rem] w-[26rem] rounded-full bg-[#EE6C4D]/15 blur-3xl dark:bg-[#EE6C4D]/10" />
        {Array.from({ length: 12 }).map((_, i) => {
          const size = 9 + (i % 4) * 3;
          return (
            <span
              key={i}
              className="sch-petal absolute top-0"
              style={
                {
                  left: `${(i * 8.3 + 3) % 100}%`,
                  width: size,
                  height: size * 1.25,
                  background: PETAL_COLORS[i % PETAL_COLORS.length],
                  borderRadius: "100% 0 100% 0",
                  animationDuration: `${15 + ((i * 5) % 9)}s`,
                  animationDelay: `-${(i * 3.1) % 16}s`,
                  "--drift": `${(i % 2 ? 1 : -1) * (60 + ((i * 29) % 140))}px`,
                  "--spin": `${(i % 2 ? 1 : -1) * (240 + ((i * 41) % 300))}deg`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>

      <div className="relative z-10 top-[-80px] mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeading title="Schedule" />

        <p className="mx-auto -mt-2 mb-5 max-w-xl text-center text-sm leading-6 text-[#3D5A80] dark:text-[#98C1D9]">
          Explore the complete lineup, timings and venues for every session
          across the festival.
        </p>

        <div className="mb-12 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#98C1D9] sm:w-28" />
          <Blossom className="h-4 w-4 text-[#EE6C4D]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#98C1D9] sm:w-28" />
        </div>

        {/* Day Selection */}
        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {days.map((day, index) => {
            const isActive = day === activeDay;
            return (
              <button
                key={day}
                aria-pressed={isActive}
                onClick={() => {
                  setActiveDay(day);
                  setActiveCategory("All");
                }}
                className={`sch-rise group relative overflow-hidden rounded-[3px] border-y-[5px] text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6C4D] ${paperCls} ${
                  isActive
                    ? "-translate-y-0.5 border-[#3D5A80] shadow-[0_20px_44px_-16px_rgba(61,90,128,0.6)] dark:border-[#98C1D9]"
                    : "border-[#98C1D9] shadow-[0_10px_24px_-14px_rgba(61,90,128,0.4)] hover:-translate-y-1 hover:border-[#3D5A80]/70 dark:border-[#98C1D9]/30 dark:hover:border-[#98C1D9]/70"
                }`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <PaperDressing strong={isActive} />

                <div className="relative z-10 flex items-start justify-between p-5">
                  <div>
                    <p
                      className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${
                        isActive
                          ? "text-[#EE6C4D]"
                          : "text-[#3D5A80] group-hover:text-[#EE6C4D] dark:text-[#98C1D9]"
                      }`}
                    >
                      {day.replace("day ", "Day ")}
                    </p>

                    <p className="mt-1 text-sm text-[#293241]/70 dark:text-[#E0FBFC]/70">
                      {Object.keys(Schedule[day]).length} Sessions
                    </p>
                  </div>

                  <div
                    className={`-rotate-6 rounded-md p-2.5 transition-all duration-300 group-hover:rotate-0 ${
                      isActive
                        ? "bg-[#EE6C4D] text-white shadow-[0_6px_14px_-4px_rgba(238,108,77,0.7)]"
                        : "bg-[#EE6C4D]/10 text-[#EE6C4D]"
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full dark:via-white/10" />
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-4">
          {/* Category Sidebar */}
          <div className="lg:col-span-1 lg:self-start lg:sticky lg:top-28">
            <div
              className={`sch-rise relative overflow-hidden rounded-[3px] border-y-[5px] border-[#3D5A80] shadow-[0_24px_54px_-20px_rgba(61,90,128,0.55)] dark:border-[#98C1D9] ${paperCls}`}
              style={{ animationDelay: "120ms" }}
            >
              <PaperDressing />

              <div className="relative z-10 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 -rotate-6 items-center justify-center rounded-md bg-[#EE6C4D] text-white shadow-[0_6px_14px_-4px_rgba(238,108,77,0.7)]">
                    <Blossom className="h-5 w-5" />
                  </span>

                  <div className="min-w-0">
                    <h2 className="text-lg font-extrabold tracking-tight text-[#3D5A80] dark:text-[#98C1D9]">
                      Categories
                    </h2>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="h-px w-7 bg-[#EE6C4D]/70" />

                      <p className="text-[11px] text-[#293241]/60 dark:text-[#E0FBFC]/60">
                        Filter sessions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setActiveCategory("All")}
                    className={`sch-cat group relative flex w-full items-center justify-between overflow-hidden rounded-md border p-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6C4D] ${
                      activeCategory === "All"
                        ? "border-[#3D5A80] bg-gradient-to-r from-[#3D5A80] to-[#2f4a6b] text-white shadow-[0_10px_22px_-10px_rgba(61,90,128,0.8)]"
                        : "border-[#98C1D9] bg-white/60 text-[#293241] hover:border-[#EE6C4D] hover:bg-white dark:border-[#98C1D9]/30 dark:bg-[#293241]/50 dark:text-[#E0FBFC] dark:hover:border-[#EE6C4D]"
                    }`}
                  >
                    {activeCategory === "All" && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-[#EE6C4D]" />
                    )}
                    <span>
                      <span className="block text-sm font-semibold">
                        All
                      </span>

                      <span className="mt-0.5 block text-[11px] opacity-70">
                        Every session
                      </span>
                    </span>

                    <ChevronRight
                      className={`h-4 w-4 transition-all duration-200 group-hover:translate-x-0.5 ${
                        activeCategory === "All"
                          ? "text-[#EE6C4D]"
                          : "group-hover:text-[#EE6C4D]"
                      }`}
                    />
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`sch-cat group relative flex w-full items-center justify-between overflow-hidden rounded-md border p-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6C4D] ${
                        category === activeCategory
                          ? "border-[#3D5A80] bg-gradient-to-r from-[#3D5A80] to-[#2f4a6b] text-white shadow-[0_10px_22px_-10px_rgba(61,90,128,0.8)]"
                          : "border-[#98C1D9] bg-white/60 text-[#293241] hover:border-[#EE6C4D] hover:bg-white dark:border-[#98C1D9]/30 dark:bg-[#293241]/50 dark:text-[#E0FBFC] dark:hover:border-[#EE6C4D]"
                      }`}
                    >
                      {category === activeCategory && (
                        <span className="absolute left-0 top-0 h-full w-1 bg-[#EE6C4D]" />
                      )}
                      <span>
                        <span className="block text-sm font-semibold capitalize">
                          {category}
                        </span>

                        <span className="mt-0.5 block text-[11px] opacity-70">
                          {Schedule[activeDay][category].length} session
                          {Schedule[activeDay][category].length > 1 ? "s" : ""}
                        </span>
                      </span>

                      <ChevronRight
                        className={`h-4 w-4 transition-all duration-200 group-hover:translate-x-0.5 ${
                          category === activeCategory
                            ? "text-[#EE6C4D]"
                            : "group-hover:text-[#EE6C4D]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Event Cards */}
          <div className="lg:col-span-3">
            <div
              className={`sch-rise relative overflow-hidden rounded-[3px] border-y-[5px] border-[#3D5A80] shadow-[0_28px_64px_-22px_rgba(61,90,128,0.55)] dark:border-[#98C1D9] ${paperCls}`}
              style={{ animationDelay: "200ms" }}
            >
              <PaperDressing />

              <div className="relative z-10 m-2 rounded-[2px] border border-[#3D5A80]/20 p-4 sm:m-3 sm:p-6 dark:border-[#98C1D9]/30">
                <div className="mb-7 flex items-end justify-between gap-4 border-b border-[#3D5A80]/15 pb-5 dark:border-[#98C1D9]/20">
                  <div>
                    <p className="text-sm font-semibold capitalize text-[#3D5A80]/80 dark:text-[#98C1D9]/80">
                      {activeDay}
                    </p>

                    <h2 className="mt-1 text-2xl font-black tracking-tight text-[#EE6C4D] drop-shadow-[0_4px_18px_rgba(238,108,77,0.25)] sm:text-3xl">
                      {activeCategory === "All"
                        ? "All Sessions"
                        : `${activeCategory} Sessions`}
                    </h2>
                  </div>

                  <div className="-rotate-3 rounded-md border border-[#98C1D9] bg-white/70 px-4 py-2 text-center dark:border-[#98C1D9]/30 dark:bg-[#293241]/50">
                    <p className="text-2xl font-extrabold leading-none text-[#3D5A80] dark:text-[#98C1D9]">
                      {categoryEvents.length}
                    </p>

                    <p className="mt-1 text-[11px] text-[#293241]/60 dark:text-[#E0FBFC]/60">
                      Events
                    </p>
                  </div>
                </div>

                {/* Timeline of sessions, ordered by time */}
                <div className="relative space-y-5 pl-7 sm:pl-9">
                  <div className="absolute bottom-0 left-[11.5px] top-0 w-px bg-gradient-to-b from-[#EE6C4D]/70 via-[#98C1D9] to-transparent" />

                  {categoryEvents.map((event: EventType, index: number) => (
                    <div
                      key={`${activeDay}-${activeCategory}-${index}`}
                      className="sch-reveal relative"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      {/* Timeline blossom */}
                      <div className="absolute -left-7 top-5 flex h-6 w-6 items-center justify-center rounded-full border border-[#98C1D9] bg-[#E0FBFC] sm:-left-9 dark:border-[#98C1D9]/50 dark:bg-[#293241]">
                        <Blossom className="h-3.5 w-3.5 text-[#EE6C4D]" />
                      </div>

                      <div className="sch-event group relative overflow-hidden rounded-md border border-[#98C1D9] bg-white/75 p-5 shadow-[0_8px_20px_-14px_rgba(61,90,128,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#EE6C4D]/60 hover:bg-white hover:shadow-[0_16px_34px_-16px_rgba(61,90,128,0.6)] dark:border-[#98C1D9]/25 dark:bg-[#293241]/55 dark:hover:bg-[#293241]/80">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-[#3D5A80]/80 dark:text-[#98C1D9]/80">
                              {activeCategory === "All"
                                ? "Festival Session"
                                : activeCategory}
                            </p>

                            <h3 className="mt-1 text-lg font-bold text-[#293241] transition-colors duration-200 group-hover:text-[#EE6C4D] dark:text-[#E0FBFC]">
                              {event.name}
                            </h3>
                          </div>

                          <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-[#EE6C4D]/40 bg-[#EE6C4D]/10 px-3 py-1.5 text-xs font-semibold text-[#293241] dark:text-[#E0FBFC]">
                            <Clock className="h-4 w-4 text-[#EE6C4D]" />
                            {event.time}
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-[#293241]/75 dark:text-[#E0FBFC]/70">
                          {event.description}
                        </p>

                        <div className="mt-4 flex flex-col gap-2 border-t border-[#3D5A80]/10 pt-3 text-xs text-[#3D5A80] sm:flex-row sm:flex-wrap sm:gap-5 dark:border-[#98C1D9]/15 dark:text-[#98C1D9]">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#EE6C4D]" />
                            <span>{event.place}</span>
                          </div>

                          {event.speakers && event.speakers.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-[#EE6C4D]" />
                              <span>{event.speakers.join(", ")}</span>
                            </div>
                          )}
                        </div>

                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#EE6C4D] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sch-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes sch-reveal {
          from { opacity: 0; transform: translateY(18px); filter: blur(4px); }
          to { opacity: 1; transform: none; filter: blur(0); }
        }
        @keyframes sch-fall {
          0% { transform: translate3d(0,-12vh,0) rotate(0deg); opacity: 0; }
          10% { opacity: .7; }
          90% { opacity: .7; }
          100% { transform: translate3d(var(--drift),112vh,0) rotate(var(--spin)); opacity: 0; }
        }
        .sch-rise { animation: sch-rise .6s cubic-bezier(.22,1,.36,1) both; }
        .sch-reveal { animation: sch-reveal .5s cubic-bezier(.22,1,.36,1) both; }
        .sch-petal { animation: sch-fall linear infinite; }
        .sch-cat:hover { transform: translateX(3px); }

        @media (prefers-reduced-motion: reduce) {
          .sch-rise, .sch-reveal, .sch-petal { animation: none !important; }
          .sch-petal { display: none; }
          .sch-cat:hover { transform: none; }
        }
      `}</style>
    </div>
  );
};

export default SchedulePage;