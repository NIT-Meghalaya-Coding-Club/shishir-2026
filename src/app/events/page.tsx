"use client";
import React from "react";
import Image from "next/image";
import Inav from "@/components/events/internal-nav";
import { useEffect, useState } from "react";
import EventDetailsModal, { type EventRecord } from "@/components/events/event-details-modal";
import Head from "next/head";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import PageHeading from "@/components/PageHeading";

import Blossom from "@/components/Blossom";

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
        <div className="absolute inset-0 bg-[#E0FBFC]/80 pointer-events-none transition-colors duration-300" />

        {/* Content container */}
        <div className="relative w-full">
          {/* Header Section */}
          <PageHeading title="Events" />

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
                  <div className="absolute inset-0 bg-[#E0FBFC]/70 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-transform duration-300" />

                  {/* Border Layer */}
                  <div className="absolute inset-0 border border-[#98C1D9]/60 rounded-full" />

                  {/* Content */}
                  <div className="relative px-4 sm:px-10 py-2 sm:py-4 flex items-center justify-center gap-2 sm:gap-4 z-10">
                    <Blossom className="w-8 h-8 sm:w-10 sm:h-10 text-[#EE6C4D] animate-spin [animation-duration:3s]" />
                    <h2
                      className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#293241] uppercase tracking-widest whitespace-nowrap drop-shadow-sm"
                    >
                      {category.replace("_", " ")}
                    </h2>
                    <Blossom className="w-8 h-8 sm:w-10 sm:h-10 text-[#EE6C4D] animate-spin [animation-duration:3s]" />
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
                              unoptimized
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