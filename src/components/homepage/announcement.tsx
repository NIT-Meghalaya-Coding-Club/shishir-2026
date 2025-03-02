"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const EventAnnouncement = () => {
  const [activeUnlock, setActiveUnlock] = useState(0);
  const [selectedUnlock, setSelectedUnlock] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  const unlockDates = useMemo(() => [
    new Date("2025-03-01T00:00:00"), // MUN Registration Begins
    new Date("2025-03-02T00:00:00"), // Panache Registration Begins
    new Date("2025-03-04T00:00:00"), // Dance Club Registration Begins
    new Date("2025-04-04T00:00:00"), // Event Date
  ], []);
  
  const unlockContent = [
    {
      title: "MUN Registration Begins",
      description: "Register now for NITM-MUN'25 and be part of the debate!",
      color: "from-purple-800 to-pink-900",
      emoji: "🗣️", 
      link: "https://docs.google.com/forms/d/1vbrhrbnte5RRreJOnH3nQlgewDCuSv2aLWFw_czVg4c/viewform?ts=67bde88f&edit_requested=true",
    },
    {
      title: "Panache Registration Begins",
      description: "Get ready for the ultimate fashion showdown!",
      color: "from-blue-900 to-indigo-900",
      emoji: "👗",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdlssD9Fyi1OkVPkmCJWM_zKyxjlv7j_tmx9oPbZntbNzl48Q/viewform",
    },
    {
      title: "Dance Club Event Registration Begins",
      description: "Show your moves and join the biggest dance competition!",
      color: "from-yellow-700 to-orange-900",
      emoji: "💃",
      link: "/tickets/dance",
    },
    {
      title: "Event Day",
      description: "The big day is here! We can't wait to see you!",
      color: "from-green-800 to-emerald-900",
      emoji: "🎊",
      link: "/event-day",
    },
  ];
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateTimer = () => {
      const now = new Date();

      // Find the next upcoming unlock
      let nextUnlockIndex = unlockDates.findIndex((date) => date > now);
      if (nextUnlockIndex === -1) nextUnlockIndex = unlockDates.length - 1;

      // Set active unlock to the previous one (or 0 if none have passed)
      const activeIndex = nextUnlockIndex > 0 ? nextUnlockIndex - 1 : 0;
      setActiveUnlock(activeIndex);

      // Initialize selected unlock if it's null
      if (selectedUnlock === null) {
        setSelectedUnlock(activeIndex);
      }

      // Calculate time to next unlock
      const targetDate = unlockDates[nextUnlockIndex];
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Update immediately and then every second
    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [isClient, selectedUnlock, unlockDates]);

  // Handle timeline dot click to view previous or current unlocks
  const handleUnlockClick = (index: number) => {
    // Allow clicking on any unlocked dot (past or current)
    if (index <= activeUnlock) {
      setSelectedUnlock(index);
    }
  };

  // Handle redirect to the appropriate page
  const handleDetailsClick = () => {
    if (selectedUnlock !== null && unlockContent[selectedUnlock].link) {
      window.location.href = unlockContent[selectedUnlock].link;
    }
  };

  // Render null or a loader while on server-side
  if (!isClient) {
    return (
      <div className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-gray-900 flex justify-center items-center min-h-[400px]">
        <div className="text-white text-xl">Loading event details...</div>
      </div>
    );
  }

  return (
    <div className="w-full py-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900 relative">
      {/* Top border with animated gradient */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 animate-gradient-x"></div>
      
      {/* Simple animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <motion.div
          className="absolute top-0 left-0 w-40 h-40 rounded-full bg-purple-500"
          animate={{
            x: [0, 100, 50, 0],
            y: [0, 50, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-500"
          animate={{
            x: [0, -120, -60, 0],
            y: [0, -80, -140, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          className="font-bold text-3xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-[#d4a200] to-[#ffd960] mb-2 md:mb-4 special-font tracking-wider transform hover:scale-105 transition-transform duration-300 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ANNOUNCEMENTS
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-center text-purple-200 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          A Celebration of Music, Art, and Culture Like Never Before!
        </motion.p>

        {/* Timeline dots */}
        <div className="flex justify-between items-center mb-12 max-w-4xl mx-auto px-4 relative">
          {unlockDates.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <motion.div
                className={`w-6 h-6 rounded-full ${
                  index <= activeUnlock
                    ? `bg-gradient-to-r ${unlockContent[index].color} ${
                        index === selectedUnlock ? "ring-2 ring-white" : ""
                      } cursor-pointer`
                    : "bg-gray-700"
                } flex items-center justify-center text-xs`}
                whileHover={{ scale: index <= activeUnlock ? 1.2 : 1 }}
                onClick={() => handleUnlockClick(index)}
                title={
                  index <= activeUnlock
                    ? `View ${unlockContent[index].title}`
                    : "Not yet unlocked"
                }
              >
                {index <= activeUnlock && (
                  <span role="img" aria-label="unlock icon">
                    {unlockContent[index].emoji}
                  </span>
                )}
              </motion.div>

              {/* Only show dates on medium screens and up */}
              <p
                className={`text-xs ${
                  index === selectedUnlock
                    ? "text-white font-bold"
                    : "text-gray-400"
                } mt-2 hidden md:block`}
              >
                {unlockDates[index].toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}

          {/* Connect dots with line */}
          <div className="absolute h-0.5 bg-gray-700 top-3 left-8 right-8 -z-10" />
          <motion.div
            className={`absolute h-0.5 bg-gradient-to-r ${unlockContent[activeUnlock].color} top-3 left-8 -z-10`}
            initial={{ width: "0%" }}
            animate={{
              width: `${(activeUnlock / (unlockDates.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Selected unlock information with optional link */}
        <motion.div
          key={selectedUnlock}
          className={`px-6 py-8 rounded-2xl shadow-lg bg-gradient-to-br ${
            selectedUnlock !== null ? unlockContent[selectedUnlock].color : ""
          } text-white mb-10 max-w-3xl mx-auto ${
            selectedUnlock !== null && unlockContent[selectedUnlock].link
              ? "cursor-pointer"
              : ""
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={handleDetailsClick}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="text-6xl mb-4 md:mb-0">
              {selectedUnlock !== null && unlockContent[selectedUnlock].emoji}
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center">
                {selectedUnlock !== null && unlockContent[selectedUnlock].title}{" "}
                !
                {selectedUnlock !== null &&
                  unlockContent[selectedUnlock].link && (
                    <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
                      Click for Details
                    </span>
                  )}
              </h3>
              <p className="text-white/90">
                {selectedUnlock !== null &&
                  unlockContent[selectedUnlock].description}
              </p>

              {/* Only show next unlock countdown if viewing the current active unlock */}
              {selectedUnlock === activeUnlock &&
                activeUnlock < unlockDates.length - 1 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-white/80">
                      Next unlock in:
                    </p>
                    <div className="flex gap-3 mt-2">
                      <div className="bg-white/20 px-3 py-2 rounded-lg text-center">
                        <div className="text-xl font-bold">{timeLeft.days}</div>
                        <div className="text-xs">days</div>
                      </div>
                      <div className="bg-white/20 px-3 py-2 rounded-lg text-center">
                        <div className="text-xl font-bold">
                          {timeLeft.hours}
                        </div>
                        <div className="text-xs">hours</div>
                      </div>
                      <div className="bg-white/20 px-3 py-2 rounded-lg text-center">
                        <div className="text-xl font-bold">
                          {timeLeft.minutes}
                        </div>
                        <div className="text-xs">mins</div>
                      </div>
                      <div className="bg-white/20 px-3 py-2 rounded-lg text-center">
                        <div className="text-xl font-bold">
                          {timeLeft.seconds}
                        </div>
                        <div className="text-xs">secs</div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Show navigation buttons when viewing past unlocks */}
              {selectedUnlock !== activeUnlock && (
                <div className="mt-4">
                  <button
                    className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUnlock(activeUnlock);
                    }}
                  >
                    Return to latest update
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Bottom border with decorative elements */}
        <div className="relative w-full h-8 mt-8">
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 animate-gradient-x"></div>
          <div className="absolute bottom-4 left-1/4 w-8 h-8 rounded-full bg-purple-600 transform -translate-y-1/2"></div>
          <div className="absolute bottom-4 left-2/4 w-8 h-8 rounded-full bg-pink-500 transform -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute bottom-4 left-3/4 w-8 h-8 rounded-full bg-yellow-500 transform -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default EventAnnouncement;