'use client'
import React, { useState } from "react";
import { Schedule, EventType } from "@/data/schedule";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { div } from "framer-motion/client";

const SchedulePage = () => {
  const days = Object.keys(Schedule);
  const [activeDay, setActiveDay] = useState(days[0]);
  const categories = Object.keys(Schedule[activeDay]);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundImage: 'url("/img/brickwall.png")' }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mt-10 mb-12 text-white">
          Shishir 2025
        </h1>

        {/* Day Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => {
                setActiveDay(day);
                setActiveCategory(Object.keys(Schedule[day])[0]);
              }}
              className={`p-4 rounded-lg transition-all duration-300 transform hover:scale-105
                ${
                  day === activeDay
                    ? "bg-yellow-600 text-white shadow-lg" // Golden yellow for active state
                    : "bg-white/30 backdrop-blur-md hover:bg-yellow-50/30" // Semi-transparent with yellow tint
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wider">
                    {day.replace("day ", "Day ")}
                  </p>
                  <p className="text-xs opacity-75">
                    {categories.length} Sessions
                  </p>
                </div>
                <Calendar className="w-6 h-6" />
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/30 backdrop-blur-md rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full p-3 rounded-lg transition-all duration-200
                      ${
                        category === activeCategory
                          ? "bg-yellow-600 text-white" // Golden yellow for active state
                          : "hover:bg-yellow-50/30" // Semi-transparent with yellow tint
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{category}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Event Cards */}
          <div className="lg:col-span-3">
            <div className="bg-white/30 backdrop-blur-md rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 capitalize text-yellow-600"> {/* Golden yellow for heading */}
                {activeCategory} Sessions
              </h2>
              <div className="space-y-6">
                {Schedule[activeDay][activeCategory].map((event: EventType, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 bg-white/30 backdrop-blur-md"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h3 className="text-xl font-semibold text-yellow-600"> {/* Golden yellow for event name */}
                        {event.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.place}</span>
                      </div>
                      
                      {event.speakers && event.speakers.length > 0 && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Users className="w-4 h-4" />
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