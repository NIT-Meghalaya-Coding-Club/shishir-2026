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

const SchedulePage = () => {
  const days = Object.keys(Schedule);
  const [activeDay, setActiveDay] = useState(days[0]);
  const categories = Object.keys(Schedule[activeDay]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Function to sort events by time
  const sortEventsByTime = (events: EventType[]) => {
    return events.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
      const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
      return timeA - timeB;
    });
  };

  // Get all events for the active day
  const allEvents = Object.values(Schedule[activeDay]).flat();

  // Sort all events by time
  const sortedAllEvents = sortEventsByTime(allEvents);

  // Get events for the active category
  const categoryEvents =
    activeCategory === "All"
      ? sortedAllEvents
      : sortEventsByTime(Schedule[activeDay][activeCategory]);

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundImage: 'url("/img/brickwall.png")' }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black-900/80" />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Header with decorative elements */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4 pt-10 ">
            <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-4">
            SCHEDULE
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600" />
        </div>

        {/* Day Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => {
                setActiveDay(day);
                setActiveCategory("All");
              }}
              className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 border-2
                ${
                  day === activeDay
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400 text-white shadow-xl shadow-yellow-500/20"
                    : "bg-white/10 border-white/20 backdrop-blur-lg hover:bg-white/20 text-white"
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold tracking-wider">
                    {day.replace("day ", "Day ")}
                  </p>
                  <p className="text-sm opacity-75">
                    {Object.keys(Schedule[day]).length} Sessions
                  </p>
                </div>
                <Calendar className="w-8 h-8" />
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border-2 border-white/20">
              <h2 className="text-xl font-bold mb-6 text-yellow-400">
                Categories
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`w-full p-4 rounded-lg transition-all duration-300 border-2
                    ${
                      activeCategory === "All"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400 text-white"
                        : "border-white/10 hover:border-blue-400/50 text-white/90 hover:bg-white/5"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize font-medium">All</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full p-4 rounded-lg transition-all duration-300 border-2
                      ${
                        category === activeCategory
                          ? "bg-gradient-to-r from-blue-700 to-blue-800 border-blue-400 text-white"
                          : "border-white/10 hover:border-blue-400/50 text-white/90 hover:bg-white/5"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-medium">{category}</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Event Cards */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                {activeCategory === "All" ? "All" : activeCategory} Sessions
              </h2>
              <div className="space-y-6">
                {categoryEvents.map((event: EventType, index: number) => (
                  <div
                    key={index}
                    className="border-2 border-white/20 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 bg-white/5 backdrop-blur-xl hover:bg-white/10 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h3 className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                        {event.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-white/80">
                        <Clock className="w-5 h-5" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <p className="text-white/70 mb-6 text-lg">
                      {event.description}
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-8">
                      <div className="flex items-center space-x-3 text-white/80">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        <span>{event.place}</span>
                      </div>

                      {event.speakers && event.speakers.length > 0 && (
                        <div className="flex items-center space-x-3 text-white/80">
                          <Users className="w-5 h-5 text-blue-400" />
                          <span>{event.speakers.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
