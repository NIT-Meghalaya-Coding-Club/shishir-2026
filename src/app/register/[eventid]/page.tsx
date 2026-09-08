"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import eventsData from "@/data/eventsData";
import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";
import Image from "next/image";

const DynamicForm = dynamic(
  () => import("@/components/register-form/DynamicForm"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center min-h-64">
        <div className="h-16 w-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
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
    registrationLink: "",
    rulebook: "",
    min: 1,
    max: 1,
    allowPerformanceTypes: false,
    paymentRequired: undefined as { amount: number; qrCodeUrl: string } | undefined, // Add this
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
            registrationLink: `/register/${createdEvent.code}`,
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

      for (const categoryEvents of Object.values(eventsData)) {
        const foundEvent = categoryEvents.find((event) => event.code === eventId);
        if (foundEvent) {
          setEvent({
            code: foundEvent.code,
            name: foundEvent.name,
            image: foundEvent.image,
            eventType: foundEvent.eventType || "individual",
            allowPerformanceTypes: foundEvent.allowPerformanceTypes || false,
            registrationLink: foundEvent.registrationLink,
            rulebook: foundEvent.rulebook,
            min: Math.max(1, Number(foundEvent.min) || 1),
            max: Math.max(1, Number(foundEvent.max) || 1),
            paymentRequired: foundEvent.paymentRequired,
          });
          break;
        }
      }

      setIsLoading(false);
    };

    loadEvent();
  }, [pathname, eventId]);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-950 to-black py-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4"
      >
        <h1 className="text-3xl font-bold text-center text-amber-500 mb-8">
          Event Registration:{" "}
          <span className="text-white">{event?.name || eventId}</span>
        </h1>

        {event?.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto mb-8"
          >
            <Image
              src={event.image.startsWith("http") ? event.image : `https://shishir.nitm.ac.in${event.image}`}
              width="0"
              height="0"
              sizes="100svw"
              alt={`${event.name} poster`}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </motion.div>
        )}

        {/* Event Info Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md mx-auto mb-8 bg-blue-900/50 p-5 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold text-amber-400 mb-3">Event Details</h2>
          <div className="space-y-2 text-white">
            <div className="flex justify-between">
              <span>Participation:</span>
              <span className="font-medium">
                {event.eventType === "individual" ? "Individual" : 
                 event.eventType === "team" ? "Team" : 
                 event.eventType === "performance" ? "Performance" : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Team Size:</span>
              <span className="font-medium">
                {event.min === event.max 
                  ? `${event.min} ${event.min > 1 ? 'participants' : 'participant'}`
                  : `${event.min} - ${event.max} participants`}
              </span>
            </div>
            {event.rulebook && (
              <div className="pt-2">
                <a 
                  href={event.rulebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-blue-950 font-medium py-2 px-4 rounded-md transition-colors duration-200 w-full text-center"
                >
                  View Rulebook
                </a>
              </div>
            )}
          </div>
        </motion.div>

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
        
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md mx-auto mt-8 p-4 text-center text-white/80 bg-blue-900/20 rounded-lg"
        >
          <h3 className="text-md font-medium text-amber-400 mb-2">Got Questions?</h3>
            <p className="text-sm">
            For any queries, please contact:<br />
            <span className="font-medium text-white">Gaurav Joshi</span><br />
            <span className="font-medium text-white">+91 84150 31939</span><br />
            </p>
        </motion.div>
      </motion.div>
    </div>
  );
}