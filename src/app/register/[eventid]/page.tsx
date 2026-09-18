"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";
import Image from "next/image";
import { Crown, Info, Users, Phone } from "lucide-react";

const DynamicForm = dynamic(
  () => import("@/components/register-form/DynamicForm"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center min-h-64">
        <div className="h-16 w-16 border-t-4 border-amber-400 border-solid rounded-full animate-spin"></div>
      </div>
    ),
  }
);

export default function EventPage() {
  const pathname = usePathname();
  const eventId = pathname.split("/").pop() || "";
  const [event, setEvent] = useState({
    code: "-",
    name: "-",
    image: "",
    eventType: "",
    rulebook: "",
    min: 1,
    max: 1,
    allowPerformanceTypes: false,
    paymentRequired: undefined as { amount: number; qrCodeUrl: string } | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/events/${encodeURIComponent(eventId)}`);
        const data = await response.json();

        if (response.ok && data.success && data.event) {
          const createdEvent = data.event;
          setEvent({
            code: createdEvent.code,
            name: createdEvent.name,
            image: createdEvent.posterLink,
            eventType: createdEvent.eventType || "individual",
            allowPerformanceTypes: createdEvent.allowPerformanceTypes || false,
            rulebook: createdEvent.rulebookLink,
            min: Math.max(1, Number(createdEvent.minParticipants) || 1),
            max: Math.max(1, Number(createdEvent.maxParticipants) || 1),
            paymentRequired: createdEvent.paymentRequired,
          });
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Failed to load created event:", error);
      }

      setIsLoading(false);
    };

    loadEvent();
  }, [pathname, eventId]);

  if (isLoading) return <Loading />;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundImage: `url('/img/pattern-floral.png')`,
        backgroundSize: '700px',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 backdrop-invert bg-gradient-to-br from-white/95 via-slate-100/90 to-white/95 dark:from-gray-900/80 dark:to-black/80 pointer-events-none transition-colors duration-300 fixed" />

      {/* Main Content */}
      <div className="relative w-full z-10 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 sm:gap-4 mb-4">
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-100 drop-shadow-sm pt-2">
                REGISTER
              </h1>
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-pulse" />
            </div>

            <div className="inline-block bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full px-8 py-3 border border-slate-200/60 dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
              <span className="text-xl sm:text-2xl font-bold text-amber-500 uppercase tracking-widest drop-shadow-sm">
                {event?.name || eventId}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start lg:[grid-template-rows:auto_auto_auto_1fr]">

            {/* Event Poster */}
            {event?.image && (
              <div className="order-1 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-start-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-full overflow-hidden rounded-2xl shadow-xl border-[3px] border-amber-400/80 dark:border-white/10"
                >
                  <Image
                    src={event.image.startsWith("http") ? event.image : `https://shishir.nitm.ac.in${event.image}`}
                    width={500}
                    height={500}
                    alt={`${event.name} poster`}
                    className="w-full aspect-square object-cover"
                    priority
                  />
                </motion.div>
              </div>
            )}

            {/* Event Info Section */}
            <div className="order-2 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-start-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.03)] border border-slate-200/60 dark:border-white/10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Info className="w-6 h-6 text-amber-500" />
                  <h2 className="text-xl font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-100">Event Details</h2>
                </div>

                <div className="space-y-4 text-slate-700 dark:text-slate-300 font-medium text-lg">
                  <div className="flex justify-between items-center bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/5">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Participation</span>
                    <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">
                      {event.eventType === "individual" ? "Individual" :
                        event.eventType === "team" ? "Team" :
                          event.eventType === "performance" ? "Performance" : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/5">
                    <span>Team Size</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {event.min === event.max
                        ? `${event.min} ${event.min > 1 ? 'participants' : 'participant'}`
                        : `${event.min} - ${event.max} participants`}
                    </span>
                  </div>

                  {event.rulebook && (
                    <div className="pt-4">
                      <a
                        href={event.rulebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-53 block w-full bg-slate-800 hover:bg-slate-900 dark:bg-white/10 dark:hover:bg-white/20 text-white font-extrabold uppercase tracking-widest py-3 px-4 rounded-xl text-center backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md border border-slate-700 dark:border-white/20"
                      >
                        <div className="original">View Rulebook</div>
                        <div className="letters">
                          {"View Rulebook".split("").map((char, index) => (
                            <span key={index} style={{ transitionDelay: `${index * 0.03}s` }}>
                              {char === " " ? "\u00A0" : char}
                            </span>
                          ))}
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Registration Form Wrapper */}
            <div className="order-3 lg:order-none lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:row-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-xl p-6 sm:p-10 pb-10 sm:pb-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.03)] border border-slate-200/60 dark:border-white/10"
              >
                <h2 className="text-2xl font-extrabold uppercase tracking-widest text-center text-slate-800 dark:text-slate-100 mb-8 pb-4 border-b border-slate-200/80 dark:border-white/10">
                  Registration Form
                </h2>
                <DynamicForm
                  eventId={event?.code}
                  eventName={event?.name}
                  min={event?.min}
                  max={event?.max}
                  eventType={
                    event?.eventType as
                    | "individual"
                    | "team"
                    | "performance"
                    | undefined
                  }
                  allowPerformanceTypes={event?.allowPerformanceTypes}
                  eventCode={event?.code}
                  paymentRequired={event?.paymentRequired}
                />
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="order-4 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-start-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full text-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm"
              >
                <div className="flex justify-center mb-3">
                  <Phone className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-100 mb-2">Got Questions?</h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  For any queries, please contact:<br />
                  <span className="font-bold text-slate-900 dark:text-white mt-1 block text-lg">Gaurav Joshi</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">+91 84150 31939</span>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}