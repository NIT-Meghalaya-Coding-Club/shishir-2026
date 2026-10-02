"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";
import Image from "next/image";
import { Crown, Info, Users, Phone } from "lucide-react";
import { AnimatedButton } from "@/components/events/buttons";

const DynamicForm = dynamic(
  () => import("@/components/register-form/DynamicForm"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center min-h-64">
        <div className="h-16 w-16 border-t-4 border-[#EE6C4D] border-solid rounded-full animate-spin"></div>
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
      <div className="absolute inset-0 bg-[#E0FBFC]/75 dark:bg-[#293241]/75 pointer-events-none transition-colors duration-300 fixed" />

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
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-[#EE6C4D] animate-pulse" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-[#293241] dark:text-[#E0FBFC] drop-shadow-sm pt-2">
                REGISTER
              </h1>
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-[#EE6C4D] animate-pulse" />
            </div>

            <div className="inline-block bg-[#E0FBFC]/70 dark:bg-[#293241]/80 backdrop-blur-md rounded-full px-8 py-3 border border-[#98C1D9]/60 dark:border-[#3D5A80]/50 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none">
              <span className="text-xl sm:text-2xl font-bold text-[#EE6C4D] uppercase tracking-widest drop-shadow-sm">
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
                  className="w-full overflow-hidden rounded-2xl shadow-xl border-[3px] border-[#EE6C4D]/80 dark:border-[#3D5A80]/50"
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
                className="w-full bg-[#E0FBFC]/80 dark:bg-[#293241]/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-lg border border-[#98C1D9]/60 dark:border-[#3D5A80]/50"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Info className="w-6 h-6 text-[#EE6C4D]" />
                  <h2 className="text-xl font-extrabold uppercase tracking-widest text-[#293241] dark:text-[#E0FBFC]">Event Details</h2>
                </div>

                <div className="space-y-4 text-[#3D5A80] dark:text-[#98C1D9] font-medium text-lg">
                  <div className="flex justify-between items-center bg-[#E0FBFC]/50 dark:bg-[#3D5A80]/20 p-3 px-6 rounded-full border border-[#98C1D9]/50 dark:border-[#3D5A80]/50">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Participation</span>
                    <span className="font-bold text-[#293241] dark:text-[#E0FBFC] uppercase tracking-wider text-sm">
                      {event.eventType === "individual" ? "Individual" :
                        event.eventType === "team" ? "Team" :
                          event.eventType === "performance" ? "Performance" : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#E0FBFC]/50 dark:bg-[#3D5A80]/20 p-3 px-6 rounded-full border border-[#98C1D9]/50 dark:border-[#3D5A80]/50">
                    <span>Team Size</span>
                    <span className="font-bold text-[#293241] dark:text-[#E0FBFC]">
                      {event.min === event.max
                        ? `${event.min} ${event.min > 1 ? 'participants' : 'participant'}`
                        : `${event.min} - ${event.max} participants`}
                    </span>
                  </div>

                  {event.rulebook && (
                    <div className="pt-4">
                      <AnimatedButton
                        href={event.rulebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#3D5A80] hover:bg-[#3D5A80]/90 dark:bg-[#3D5A80]/50 dark:hover:bg-[#98C1D9]/30 text-[#E0FBFC] font-extrabold uppercase tracking-widest h-14 px-4 rounded-full text-center backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md border border-[#3D5A80] dark:border-[#98C1D9]/30"
                      >
                        VIEW RULEBOOK
                      </AnimatedButton>
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
                className="w-full bg-[#E0FBFC]/60 dark:bg-[#293241]/60 backdrop-blur-xl p-6 sm:p-10 pb-10 sm:pb-12 rounded-3xl shadow-lg border border-[#98C1D9]/60 dark:border-[#3D5A80]/50"
              >
                <h2 className="text-2xl font-extrabold uppercase tracking-widest text-center text-[#293241] dark:text-[#E0FBFC] mb-8 pb-4 border-b border-[#98C1D9]/80 dark:border-[#3D5A80]/50">
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
                className="w-full text-center p-6 bg-[#E0FBFC]/50 dark:bg-[#3D5A80]/20 backdrop-blur-md rounded-2xl border border-[#98C1D9]/50 dark:border-[#3D5A80]/50 shadow-sm"
              >
                <div className="flex justify-center mb-3">
                  <Phone className="w-6 h-6 text-[#EE6C4D]" />
                </div>
                <h3 className="text-lg font-extrabold uppercase tracking-widest text-[#293241] dark:text-[#E0FBFC] mb-2">Got Questions?</h3>
                <p className="text-[#3D5A80] dark:text-[#98C1D9] font-medium">
                  For any queries, please contact:<br />
                  <span className="font-bold text-[#293241] dark:text-[#E0FBFC] mt-1 block text-lg">[TODO: ADD NAME]</span>
                  <span className="text-[#EE6C4D] dark:text-[#EE6C4D] font-bold">[TODO: ADD NUMBER]</span>
                </p>
              </motion.div>
            </div>
          </div>
          {/* </motion.div> */}

          {/* Terms and Conditions Section
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md mx-auto mb-8 bg-red-900/30 p-4 rounded-lg border border-red-500/50"
        >
          <h3 className="text-lg font-semibold text-red-300 mb-2">Important Notice:</h3>
          <p className="text-white text-sm">
            Each participant can register for only one event using their account. 
            If you wish to participate in additional events, please register using a different account.
          </p>
        </motion.div> */}
          {/*
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
        */}
        </motion.div>
      </div>
    </div>
  );
}
