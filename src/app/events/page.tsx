"use client";
import React, { useState } from "react";
import Image from "next/image";
import Inav from "@/components/events/internal-nav";
import eventsData from "@/data/eventsData";
import event_categories from "@/data/categoryData";
import { Crown, Sparkles } from "lucide-react";
import Popup from "@/components/events/popup";
import Head from "next/head";

export default function Events() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    name: string;
    description?: string;
    image: string;
    registrationLink?: string;
    rulebook?: string;
  } | null>(null);

  const openPopup = (event: {
    name: string;
    description?: string;
    image: string;
    registrationLink?: string;
    rulebook?: string;
  }) => {
    setSelectedEvent(event);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedEvent(null);
  };
  return (
    <>
      <Head>
        <link rel="preload" href="/img/brickwall.png" as="image" />
      </Head>
      <div
        className="relative flex flex-col items-center w-full h-auto min-h-screen overflow-x-hidden pb-16"
        style={{ backgroundImage: `url('/img/brickwall.png')` }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black-900/80 pointer-events-none" />

        {/* Content container */}
        <div className="relative w-full">
          {/* Header Section */}
            <div className="text-center mt-20 mb-12">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
              <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 pt-10">
                EVENTS
              </h1>
              <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
              </div>
              <div className="h-1 w-48 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
            </div>

            <Inav />

            {event_categories.map((category) => (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                    {eventsData[category]?.map((event, index) => (
                      <div
                        key={index}
                        className="w-full cursor-pointer aspect-square rounded-xl shadow-2xl relative overflow-hidden group transform transition-all duration-500 hover:scale-105"
                        onClick={() => openPopup(event)}
                      >
                        {/* Decorative border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-gradient-x rounded-tl-[20px] rounded-br-[20px]" />

                        {/* Content container */}
                        <div className="absolute inset-0.5 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-tl-[18px] rounded-br-[18px]">
                          {/* Image */}
                          <Image
                            src={event.image}
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
                              {event.registrationLink ? (
                                <a
                                  href={event.registrationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 px-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
                                >
                                  Register Now
                                </a>
                              ) : (
                                <p className="text-yellow-400/80 text-lg font-bold">
                                  Registration Coming Soon
                                </p>
                              )}

                              {event.rulebook ? (
                                <a
                                  href={event.rulebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 text-yellow-400 border border-yellow-400/30 font-bold py-2 px-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/10"
                                >
                                  View Rulebook
                                </a>
                              ) : (
                                <p className="text-gray-400/80 text-lg font-bold">
                                  Rulebook Coming Soon
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-[18px] rounded-br-[18px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Popup */}
        {selectedEvent && (
          <Popup
            isOpen={isPopupOpen}
            onClose={closePopup}
            event={selectedEvent}
          />
        )}
      </div>
    </>
  );
}
