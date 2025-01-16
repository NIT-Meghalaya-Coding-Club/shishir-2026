"use client";
import React, { useState } from "react";
import { Schedule } from "@/data/schedule";

interface EventType {
    name: string; 
    time: string; 
    place: string; 
}

const SchedulePage: React.FC = () => {
  const days = Object.keys(Schedule);

  const [activeDay, setActiveDay] = useState(days[0]);

  const categories = Object.keys(Schedule[activeDay]);

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="pt-20 h-screen w-screen flex flex-col">
      <div className="grid grid-cols-4 gap-2 p-4">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`py-2 rounded capitalize ${
              day === activeDay ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="flex flex-1 pr-5">
        <div className="w-1/4 p-4 border-r">
          <h2 className="text-xl font-bold mb-4">{activeDay}</h2>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`w-full py-2 px-3 mb-2 rounded text-left capitalize ${
                category === activeCategory ? "bg-orange-500 text-white" : "bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {Schedule[activeDay][activeCategory]?
            <div className="w-3/4 p-7 rounded-xl border border-black">
            <h2 className="text-lg font-semibold mb-4 capitalize">{activeCategory}</h2>
            <ul className="space-y-2">
                {Schedule[activeDay][activeCategory].map((item: EventType , index:number) => (
                <li key={index} className="p-2 border-b-2 border-black">
                    <p>Name: {item.name}</p>
                    <p>Time: {item.time}</p>
                    <p>Place: {item.place}</p>
                </li>
                ))}
            </ul>
            </div>
        : 
            <></>
        }
      </div>
    </div>
  );
};

export default SchedulePage;