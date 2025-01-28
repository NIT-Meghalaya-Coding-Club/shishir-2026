"use client";
import React from "react";
import Inav from "@/components/events/internal-nav";
import eventsData from "@/data/eventsData";
import event_categories from "@/data/categoryData";

export default function Events() {
  return (
    <div
      className="relative flex flex-col items-center w-full h-auto min-h-screen overflow-x-hidden pb-16"
      style={{ backgroundImage: `url('/img/brickwall.png')` }}
    >
      <h1 className="text-5xl font-bold mt-28 text-center text-gold-500">
        Events
      </h1>
      <Inav />
      {event_categories.map((category) => (
        <React.Fragment key={category}>
          <div
            id={category.toLowerCase().replace(/ /g, "-")}
            className="h-auto m-10 p-4 bg-gold-500 rounded-xl flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold text-black">
              {category.replace("_", " ")}
            </h2>
          </div>
          <div className="w-[90vw] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {eventsData[category]?.map((event, index) => (
                <div
                  key={index}
                  className="w-full h-[300px] rounded-lg shadow-lg relative overflow-hidden group border-2 border-gold-500"
                  style={{
                    backgroundImage: `url(${event.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Event Name (Visible by Default) */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-center transition-transform duration-300 group-hover:translate-y-full">
                    <p className="font-bold text-xl">{event.name}</p>
                  </div>

                  {/* Hover Overlay with Links */}
                  <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {event.registrationLink ? (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-500 text-xl font-bold mb-3 hover:text-white transition-colors duration-300 transform hover:scale-110"
                      >
                        Register
                      </a>
                    ) : (
                      <p className="text-gold-500 text-xl font-bold mb-3">
                        Register (Coming Soon)
                      </p>
                    )}
                    {event.rulebook ? (
                      <a
                        href={event.rulebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-500 text-xl font-bold hover:text-white transition-colors duration-300 transform hover:scale-110"
                      >
                        Rulebook
                      </a>
                    ) : (
                      <p className="text-gold-500 text-xl font-bold">
                        Rulebook (Coming Soon)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
