"use client";

import React, { useState, useEffect } from "react";
import { motion} from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const artists = [
  {
    id: 1,
    name: "Pandit Satish Vyas",
    genre: "Hindustani Classical",
    image: "/artists/tushar_joshi.webp",
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
    name: "DJ Alberic",
    genre: "Indie Pop",
    image: "/artists/tushar_joshi.webp",
    color: "#9B5DE5",
  },
  {
    id: 4,
    name: "DJ Infinit",
    genre: "Indie Pop",
    image: "/artists/tushar_joshi.webp",
    color: "#0000FF",
  },
];

const FeaturedArtists = () => {
  const [activeArtist, setActiveArtist] = useState<number | null>(null);
  const [decorativeElements, setDecorativeElements] = useState<{ key: number; style: React.CSSProperties }[]>([]); // State for decorative elements
  const router = useRouter();

  useEffect(() => {
    // Generate decorative elements only on the client-side
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
  }, []); // Empty dependency array ensures this runs once on mount

  const handleRedirect = () => {
    router.push("/ticket");
  };

  return (
    <div className="w-full bg-gray-900 py-16 px-4 md:px-8 relative overflow-hidden">
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
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
          Experience the incredible lineup at NITM&apos;s Cultural Fest this year!
        </p>
      </motion.div>

      {/* Artists Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {artists.map((artist) => (
            <motion.div
              key={artist.id}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
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
                <div className="aspect-square">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  // layout="fill"
                  objectFit="cover"
                  width={300}
                  height={300}
                />
                </div>
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
