"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMusic,
  FaDrum,
  FaGuitar,
  FaMicrophone,
  FaFire,
  FaSpotify,
  FaStar,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import {
  GiPartyPopper,
  GiMusicalNotes,
  GiDrumKit,
  GiSaxophone,
} from "react-icons/gi";
import { MdOutlineEmojiEvents } from "react-icons/md";
import Image from "next/image";

const ComingSoon = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will only run on the client after hydration
    setIsClient(true);
  }, []);

  const [funnyPhrases] = useState([
    "Polishing our dance shoes...",
    "Teaching the DJ how to DJ...",
    "Making sure the mic actually works...",
    "Convincing professors to join the fun...",
    "Hiding the food from hungry organizers...",
    "Practicing our 'wow faces' for performances...",
    "Making sure no one trips on stage...",
    "Convincing the dean it's educational...",
    "Trying to remember where we put the confetti...",
  ]);

  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [showEmojiBlast, setShowEmojiBlast] = useState(false);
  interface Emoji {
    emoji: string;
    x: number;
    y: number;
    size: number;
    rotation: number;
    delay: number;
  }

  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Update window dimensions only on the client side
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Set target date to February 15, 2025
    const targetDate = new Date("March 02, 2025").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    // Rotate through funny phrases
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % funnyPhrases.length);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(phraseInterval);
    };
  }, [funnyPhrases]);

  const triggerEmojiBlast = () => {
    const emojiList = [
      "🎭",
      "🎨",
      "🎵",
      "💃",
      "🕺",
      "🎤",
      "🎸",
      "🎹",
      "🎷",
      "🎺",
      "🎻",
      "🪘",
      "✨",
      "🎉",
      "🎊",
    ];

    // Create 20 random emojis with random positions
    const newEmojis = Array.from({ length: 20 }, () => ({
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      x: Math.random() * 100, // percentage of screen width
      y: Math.random() * 100, // percentage of screen height
      size: Math.random() * 3 + 1, // random size between 1-4rem
      rotation: Math.random() * 360, // random rotation
      delay: Math.random() * 0.5, // random delay for animation
    }));

    setEmojis(newEmojis);
    setShowEmojiBlast(true);

    // Play drum sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }

    // Hide the emojis after 2 seconds
    setTimeout(() => {
      setShowEmojiBlast(false);
    }, 2000);
  };

  // Floating icons for background
  const floatingIcons = [
    FaMusic,
    FaDrum,
    FaGuitar,
    FaMicrophone,
    GiPartyPopper,
    GiMusicalNotes,
    GiDrumKit,
    GiSaxophone,
    FaStar,
    MdOutlineEmojiEvents,
    FaFire,
    FaSpotify,
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a2351] to-[#071330] overflow-hidden relative">
      {/* Audio element for drum sound */}
      <audio ref={audioRef} src="sound/drum-sound.mp3" preload="auto" />

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffd700' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Animated floating icons */}
      {isClient &&
        floatingIcons.map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-[#f1c232] opacity-20 text-4xl sm:text-5xl"
            initial={{
              x:
                typeof window !== "undefined"
                  ? Math.random() * windowSize.width
                  : 0,
              y:
                typeof window !== "undefined"
                  ? Math.random() * windowSize.height
                  : 0,
              rotate: Math.random() * 180,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: [
                Math.random() * (windowSize.width || 500),
                Math.random() * (windowSize.width || 500),
                Math.random() * (windowSize.width || 500),
              ],
              y: [
                Math.random() * (windowSize.height || 500),
                Math.random() * (windowSize.height || 500),
                Math.random() * (windowSize.height || 500),
              ],
              rotate: [0, Math.random() * 360, 0],
              scale: [
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 1,
                Math.random() * 0.5 + 0.5,
              ],
            }}
            transition={{
              duration: 15 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon />
          </motion.div>
        ))}

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 rounded-full bg-[#f1c232] opacity-30 blur-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-[#f1c232] opacity-20 blur-lg"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#f1c232] opacity-10 blur-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-6xl px-4 py-12 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-8"
          style={{ filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))" }}
        >
          <Image
            src="/assets/logo.png"
            alt="Shishir 2025 Logo"
            width={256}
            height={256}
            className="w-48 h-48 sm:w-64 sm:h-64"
          />
        </motion.div>

        {/* Title with gradient text */}
        <motion.h1
          className="text-5xl sm:text-7xl font-extrabold mb-4 tracking-tighter"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.span
            className="bg-gradient-to-r from-[#f1c232] to-[#ffd700] text-transparent bg-clip-text"
            animate={{
              textShadow: [
                "0 0 10px rgba(255, 215, 0, 0.3)",
                "0 0 20px rgba(255, 215, 0, 0.6)",
                "0 0 10px rgba(255, 215, 0, 0.3)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            SHISHIR 2025
          </motion.span>
        </motion.h1>

        <h2 className="text-2xl md:text-3xl mb-8 text-white">
          The Ultimate{" "}
          <span className="text-[#f1c232] font-bold">Cultural Fest</span> Is
          Coming!
        </h2>

        {/* Funny phrase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhrase}
            className="h-16 flex items-center justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl italic text-[#f1c232]">
              &quot;{funnyPhrases[currentPhrase]}&quot;
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Countdown timer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-3xl mb-12">
          {[
            { label: "DAYS", value: countdown.days },
            { label: "HOURS", value: countdown.hours },
            { label: "MINUTES", value: countdown.minutes },
            { label: "SECONDS", value: countdown.seconds },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <motion.div
                className="w-full h-24 relative flex flex-col justify-center items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    backgroundColor: "#0a2351",
                    border: "2px solid #f1c232",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(255, 215, 0, 0.3)",
                      "0 0 20px rgba(255, 215, 0, 0.6)",
                      "0 0 10px rgba(255, 215, 0, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    delay: index * 0.5,
                    repeat: Infinity,
                  }}
                />
                <span className="relative z-10 block text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#f1c232] to-[#ffd700] text-transparent bg-clip-text">
                  {item.value}
                </span>
                <span className="relative z-10 text-sm md:text-base text-[#f1c232] font-medium">
                  {item.label}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Social media links */}
        <div className="flex justify-center gap-6 mb-8">
          {[
            {
              icon: FaFacebookF,
              href: "https://www.facebook.com/shishirnitmeghalaya",
            },
            {
              icon: FaInstagram,
              href: "https://www.instagram.com/shishir_nitm/",
            },
            { icon: FaYoutube, href: "https://www.youtube.com/@shishir_nitm" },
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className="w-12 h-12 rounded-full bg-[#f1c232] flex items-center justify-center text-[#071330] relative overflow-hidden group"
              whileHover={{ scale: 1.2, rotate: index % 2 === 0 ? 10 : -10 }}
              whileTap={{ scale: 0.9 }}
            >
              <item.icon className="relative z-10" size={24} />
              <motion.span
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Funny clickable button */}
        <motion.button
          className="mt-6 px-6 py-4 bg-gradient-to-r from-[#f1c232] to-[#ffd700] text-[#071330] font-bold text-lg rounded-full relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{
            scale: 0.9,
            rotate: [0, 5, -5, 0],
          }}
          onClick={triggerEmojiBlast}
        >
          <span className="relative z-10 flex items-center justify-center">
            <GiPartyPopper className="mr-2" /> Click For Cultural Explosion!{" "}
            <GiPartyPopper className="ml-2" />
          </span>
        </motion.button>

        {/* Warning text */}
        <motion.p
          className="mt-8 text-[#f1c232]/70 text-sm italic max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Warning: Side effects may include uncontrollable dancing, excessive
          fun, and temporary loss of academic seriousness!
        </motion.p>
      </div>

      {/* Emoji blast */}
      <AnimatePresence>
        {showEmojiBlast && (
          <>
            {emojis.map((emoji, index) => (
              <motion.div
                key={index}
                className="fixed text-4xl z-50"
                initial={{
                  x: "50vw",
                  y: "50vh",
                  scale: 0,
                  opacity: 0,
                  rotate: 0,
                }}
                animate={{
                  x: `${emoji.x}vw`,
                  y: `${emoji.y}vh`,
                  scale: emoji.size,
                  opacity: [0, 1, 0],
                  rotate: emoji.rotation,
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 1.5,
                  delay: emoji.delay,
                  ease: "easeOut",
                }}
              >
                {emoji.emoji}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComingSoon;
