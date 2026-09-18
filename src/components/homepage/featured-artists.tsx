"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const artists = [
  {
    id: 1,
    name: "Pandit Satish Vyas",
    genre: "Hindustani Classical",
    image: "/artists/pandit.webp",
    color: "#FF5E5B",
  },
  {
    id: 2,
    name: "Tushar Joshi",
    genre: "Bollywood",
    image: "/artists/tushar_joshi.webp",
    color: "#22BABB",
  },
  {
    id: 3,
    name: "Demo Artist",
    genre: "Coming Soon",
    image: "/artists/tushar_joshi.webp",
    color: "#7C3AED",
  },
];

const FeaturedArtists = () => {
  const [activeArtist, setActiveArtist] = useState<number | null>(null);
  const [decorativeElements, setDecorativeElements] = useState<
    { key: number; style: React.CSSProperties }[]
  >([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const elements = [...Array(20)].map((_, i) => ({
      key: i,
      style: {
        background: `${artists[i % artists.length].color}`,
        width: `${Math.random() * 100 + 50}px`,
        height: `${Math.random() * 100 + 50}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      },
    }));
    setDecorativeElements(elements);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const cardsContainer = cardsRef.current;
    const button = buttonRef.current;
    if (!section || !cardsContainer || !button) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-artist-card]");
      if (!cards.length) return;

      const setCompressedState = () => {
        gsap.set(cards, { x: 0, y: 0, scale: 1, opacity: 1 });
        const buttonRect = button.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        cards.forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          gsap.set(card, {
            x: buttonCenterX - (cardRect.left + cardRect.width / 2),
            y: buttonCenterY - (cardRect.top + cardRect.height / 2),
            scale: 0.12,
            opacity: 0.45,
            transformOrigin: "center center",
          });
        });
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=240%",
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: setCompressedState,
        },
      });

      setCompressedState();
      timeline.to(cards, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 2,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleRedirect = () => {
    router.push("/ticket");
  };

  return (
    <div
      ref={sectionRef}
      className="w-full min-h-screen flex flex-col justify-center bg-slate-50 dark:bg-gray-900 py-16 px-4 md:px-8 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {decorativeElements.map((element) => (
          <motion.div
            key={element.key}
            className="absolute rounded-full opacity-20"
            style={element.style}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              scale: [1, Math.random() * 0.5 + 0.8, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Header with animated gradient text */}
      <motion.div
        className="relative z-10 text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="font-bold text-3xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-[#d4a200] to-[#ffd960] special-font tracking-wider transform hover:scale-105 transition-transform duration-300 text-center">
          Featured Artists
        </h2>
        <motion.div
          className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
        <p className="text-slate-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto font-medium dark:font-normal transition-colors duration-300">
          Experience the incredible lineup at NITM&apos;s Cultural Fest this year!
        </p>
      </motion.div>

      {/* Artists Grid */}
      <div className="flex justify-center">
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full"
        >
          {artists.map((artist) => (
            <motion.div
              key={artist.id}
              data-artist-card
              className="relative rounded-xl overflow-hidden cursor-pointer group w-full aspect-square"
              whileHover={{
                scale: 1.05,
                zIndex: 20,
                boxShadow: `0 0 30px ${artist.color}`,
              }}
              onClick={() =>
                setActiveArtist(activeArtist === artist.id ? null : artist.id)
              }
              layout
            >
              <motion.div
                className="absolute inset-0 opacity-90"
                whileHover={{ opacity: 0.8 }}
              />
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl" // Match the container's rounding
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated call to action */}
      <motion.div
        className="mt-12 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          ref={buttonRef}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-bold text-lg"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(131, 56, 236, 0.7)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRedirect}
        >
          Grab Your Tickets!
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FeaturedArtists;