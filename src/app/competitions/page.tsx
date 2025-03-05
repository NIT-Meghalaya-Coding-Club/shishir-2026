"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GenreListEnhanced } from "../../components/competition/GenreListEnhanced";
import { FAQEnhanced } from "../../components/competition/FAQEnhanced";
import { genreData } from "@/data/genreData";

// Updated interface to match our enhanced component
interface Competition {
  name: string;
  posterUrl: string;
  registerLink: string;  // Added register link
}

interface Genre {
  name: string;
  competitions: Competition[];
}

// Type assertion using our updated genreData with register links
const genresWithPosters = genreData as unknown as Genre[];

const Competition: React.FC = () => {
  const [activeTab, setActiveTab] = useState("genres");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-blue-900 min-h-screen text-white">
      {/* Hero Section with Particle Animation */}
      <div className="relative overflow-hidden h-96">
        <div id="particles-js" className="absolute inset-0 opacity-60"></div>
        <motion.div
          className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 pt-20 mb-6 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              yoyo: Infinity,
              ease: "easeInOut",
              repeatDelay: 3,
            }}
          >
            SHISHIR 2025
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-center max-w-3xl border-b-2 border-yellow-500 pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Unleash your talent at the north east&apos;s most prestigious
            college competition festival
          </motion.p>
        </motion.div>

        {/* <motion.div
          className="absolute top-20 right-10 text-yellow-500 text-4xl"
          initial={{ rotate: 0, opacity: 0.7 }}
          animate={{ rotate: 360, opacity: 1 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          👑
        </motion.div> */}
      </div>

      {/* Navigation Tabs */}
      <div
        className={`sticky top-0 z-30 bg-black/80 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "py-2 shadow-md shadow-blue-900/50" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-2 md:space-x-8">
            <motion.button
              className={`px-6 py-3 text-lg font-bold rounded-t-lg transition-all duration-300 ${
                activeTab === "genres"
                  ? "bg-gradient-to-r from-blue-900 to-blue-700 border-b-4 border-yellow-500"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
              onClick={() => setActiveTab("genres")}
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
            >
              GENRES
            </motion.button>
            <motion.button
              className={`px-6 py-3 text-lg font-bold rounded-t-lg transition-all duration-300 ${
                activeTab === "faqs"
                  ? "bg-gradient-to-r from-blue-900 to-blue-700 border-b-4 border-yellow-500"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
              onClick={() => setActiveTab("faqs")}
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
            >
              FAQs
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        {activeTab === "genres" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GenreListEnhanced genres={genresWithPosters} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FAQEnhanced />
          </motion.div>
        )}
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-transparent to-black/70">
        {/* Team content here */}
      </div>
    </div>
  );
};

export default Competition;