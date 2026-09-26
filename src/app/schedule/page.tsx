
"use client";

import React, { useState } from "react";
import { Schedule, EventType } from "@/data/schedule";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Crown,
} from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

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
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#090d17]">
      {/* Soft blurred particle background */}
      <div className="particle-field pointer-events-none absolute inset-0" />

      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl animate-float-slow" />

        <div className="absolute -right-24 top-[42%] h-64 w-64 rounded-full bg-blue-500/10 blur-3xl animate-float-slower" />

        <div className="absolute left-[8%] top-[36%] h-4 w-4 rotate-45 border border-slate-300/40 dark:border-white/10 animate-float" />

        <div className="absolute right-[10%] top-[24%] h-5 w-5 rounded-full border border-amber-400/40 animate-float" />

        <div className="absolute bottom-[18%] right-[6%] h-7 w-7 rotate-45 border border-blue-400/20 animate-float-slow" />

        <div className="absolute left-[-70px] top-[62%] h-px w-64 rotate-[24deg] bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />

        <div className="absolute right-[-80px] top-[34%] h-px w-72 -rotate-[26deg] bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 pt-8 text-center animate-fade-up">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/5">
              <Crown className="h-8 w-8 text-yellow-400 animate-pulse" />
            </div>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Shishir 2026
          </p>

          <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 sm:text-6xl">
            SCHEDULE
          </h1>

          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Explore the complete lineup, timings and venues for every session
            across the festival.
          </p>
        </div>

        {/* Day Selection */}
        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {days.map((day, index) => (
            <button
              key={day}
              onClick={() => {
                setActiveDay(day);
                setActiveCategory("All");
              }}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 animate-fade-up ${
                day === activeDay
                  ? "border-yellow-400/50 bg-white shadow-lg shadow-yellow-500/10 dark:border-yellow-400/40 dark:bg-white/[0.04]"
                  : "border-slate-200 bg-white hover:-translate-y-1 hover:border-yellow-400/30 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.02]"
              }`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-yellow-600 dark:text-yellow-400">
                    DAY {String(index + 1).padStart(2, "0")}
                  </p>

                  <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    {day.replace("day ", "Day ")}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {Object.keys(Schedule[day]).length} Sessions
                  </p>
                </div>

                <div className="rounded-xl bg-yellow-400/10 p-2.5 text-yellow-500">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-4">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="category-box rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0d1320]">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-yellow-300 dark:bg-white dark:text-slate-900">
                  01
                </span>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Categories
                  </h2>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-px w-7 bg-yellow-500/60" />

                    <p className="text-[11px] text-slate-400">
                      Filter sessions
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`category-item group flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
                    activeCategory === "All"
                      ? "border-blue-500/30 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/10"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-400/30 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.02] dark:text-white"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-medium">
                      All
                    </span>

                    <span className="mt-0.5 block text-[10px] opacity-60">
                      Every session
                    </span>
                  </span>

                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`category-item group flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
                      category === activeCategory
                        ? "border-blue-500/30 bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-md shadow-blue-500/10"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-400/30 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.02] dark:text-white"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-medium capitalize">
                        {category}
                      </span>

                      <span className="mt-0.5 block text-[10px] opacity-60">
                        {Schedule[activeDay][category].length} session
                        {Schedule[activeDay][category].length > 1 ? "s" : ""}
                      </span>
                    </span>

                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Event Cards */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0d1320]">
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {activeDay}
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
                    {activeCategory === "All"
                      ? "All Sessions"
                      : `${activeCategory} Sessions`}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-yellow-500">
                    {categoryEvents.length}
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Events
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {categoryEvents.map((event: EventType, index: number) => (
                  <div
                    key={`${activeDay}-${activeCategory}-${index}`}
                    className="event-card group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-400/30 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.02]"
                    style={{
                      animation:
                        "sessionReveal 500ms cubic-bezier(.22,1,.36,1) both",
                      animationDelay: `${index * 90}ms`,
                    }}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-400/10 text-[10px] font-bold text-yellow-500">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            {activeCategory === "All"
                              ? "Festival Session"
                              : activeCategory}
                          </p>

                          <h3 className="schedule-name mt-1 text-lg font-bold">
                            {event.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        {event.time}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-white/60 md:ml-13">
                      {event.description}
                    </p>

                    <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 dark:text-white/60 sm:flex-row sm:flex-wrap sm:gap-5 md:ml-13">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{event.place}</span>
                      </div>

                      {event.speakers && event.speakers.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{event.speakers.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-yellow-400 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
      </div>

      <style jsx>{`
        .particle-field {
          position: absolute;
          inset: -10%;
          pointer-events: none;
          opacity: 0.55;
          filter: blur(18px);
          background:
            radial-gradient(
              circle at 10% 20%,
              rgba(250, 204, 21, 0.16) 0 5px,
              transparent 18px
            ),
            radial-gradient(
              circle at 24% 70%,
              rgba(59, 130, 246, 0.12) 0 4px,
              transparent 16px
            ),
            radial-gradient(
              circle at 40% 30%,
              rgba(250, 204, 21, 0.12) 0 6px,
              transparent 18px
            ),
            radial-gradient(
              circle at 58% 78%,
              rgba(59, 130, 246, 0.1) 0 5px,
              transparent 17px
            ),
            radial-gradient(
              circle at 72% 26%,
              rgba(250, 204, 21, 0.13) 0 5px,
              transparent 18px
            ),
            radial-gradient(
              circle at 88% 65%,
              rgba(59, 130, 246, 0.1) 0 4px,
              transparent 16px
            );

          animation: particle-move 18s ease-in-out infinite alternate;
        }

        .category-box {
          position: relative;
          overflow: hidden;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease;
        }

        .category-box::before {
          content: "";
          position: absolute;
          top: 0;
          left: 18px;
          width: 70px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #eab308,
            transparent
          );
          opacity: 0.8;
        }

        .category-box:hover {
          border-color: rgba(234, 179, 8, 0.22);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.07);
        }

        .category-item:hover {
          transform: translateX(3px);
        }

        .event-card {
          transition:
            transform 250ms ease,
            border-color 250ms ease,
            box-shadow 250ms ease;
        }

        .event-card:hover {
          transform: translateY(-2px);
          border-color: rgba(234, 179, 8, 0.3);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
        }

        /* Session name */
        .schedule-name {
          color: #1f2937 !important;
          transition: color 200ms ease;
        }

        :global(.dark) .schedule-name {
          color: #ffffff !important;
        }

        :global([data-theme="dark"]) .schedule-name {
          color: #ffffff !important;
        }

        .event-card:hover .schedule-name {
          color: #facc15 !important;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes sessionReveal {
          from {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes particle-move {
          0% {
            transform: translate3d(-1%, -1%, 0) scale(1);
          }

          50% {
            transform: translate3d(2%, -2%, 0) scale(1.04);
          }

          100% {
            transform: translate3d(-2%, 2%, 0) scale(0.98);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(45deg);
          }

          50% {
            transform: translateY(-8px) rotate(55deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(10px, -8px);
          }
        }

        @keyframes float-slower {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-10px, 9px);
          }
        }

        .animate-fade-up {
          animation: fade-up 450ms ease both;
        }

        .animate-float {
          animation: float 7s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 12s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up,
          .animate-float,
          .animate-float-slow,
          .animate-float-slower,
          .particle-field,
          .event-card {
            animation: none !important;
          }

          .event-card,
          .schedule-name,
          .category-item {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SchedulePage;

