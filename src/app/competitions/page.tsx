"use client";

import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

const genres = [
  {
    name: "CULTURAL",
    competitions: ["Spic Macay", "Traditional Dance"],
  },
  {
    name: "MUSIC",
    competitions: ["Battle of Bands", "Symphony", "Open Mic"],
  },
  {
    name: "GAMING",
    competitions: ["PC Gaming"],
  },
  {
    name: "DANCE",
    competitions: ["Step Up"],
  },
];

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
            Unleash your talent at the north east's most prestigious college
            competition festival
          </motion.p>
        </motion.div>

        {/* Animated Crown Symbol */}
        <motion.div
          className="absolute top-10 right-10 text-yellow-500 text-4xl"
          initial={{ rotate: 0, opacity: 0.7 }}
          animate={{ rotate: 360, opacity: 1 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          👑
        </motion.div>
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
            <GenreListEnhanced genres={genres} />
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
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-yellow-500 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="before:content-[''] before:absolute before:w-24 before:h-1 before:bg-yellow-500 before:-bottom-4 before:left-1/2 before:-translate-x-1/2">
            Competitions Head
          </span>
        </motion.h2>

        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-12 space-y-8 md:space-y-0 mt-8">
          <motion.div
            className="bg-gradient-to-br from-blue-900 to-gray-900 p-6 rounded-xl shadow-lg shadow-blue-900/30 w-full md:w-80 text-center border border-blue-700 relative overflow-hidden"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
            }}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500 -translate-y-1/2 translate-x-1/2 transform rotate-45 opacity-20"></div>
            <h3 className="text-2xl font-bold mb-2 text-yellow-400">
              aaaaaaaaaaa
            </h3>
            <p className="text-lg mb-4 text-gray-300">
              Competitions Coordinator
            </p>
            <p className="flex items-center justify-center space-x-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-telephone-fill"
                viewBox="0 0 16 16"
              >
                <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
              </svg>
              <span>+91 7066615145</span>
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-blue-900 to-gray-900 p-6 rounded-xl shadow-lg shadow-blue-900/30 w-full md:w-80 text-center border border-blue-700 relative overflow-hidden"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
            }}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500 -translate-y-1/2 translate-x-1/2 transform rotate-45 opacity-20"></div>
            <h3 className="text-2xl font-bold mb-2 text-yellow-400">
              bbbbbbbbb
            </h3>
            <p className="text-lg mb-4 text-gray-300">Competitions Head</p>
            <p className="flex items-center justify-center space-x-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-telephone-fill"
                viewBox="0 0 16 16"
              >
                <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
              </svg>
              <span>+91 9399359503</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const GenreListEnhanced: React.FC<{ genres: any[] }> = ({ genres }) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {genres.map((genre, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-lg overflow-hidden shadow-xl border border-blue-800 hover:border-yellow-500 transition-all duration-300 relative group"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{
            y: -5,
            boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="px-8 pt-8 pb-4">
            <div
              className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-yellow-500 rotate-45 opacity-20 
                          group-hover:opacity-40 transition-opacity duration-300"
            ></div>
            <motion.h3
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 relative z-10 tracking-wider text-center mb-4"
              animate={{
                textShadow: [
                  "0 0 5px rgba(255,215,0,0)",
                  "0 0 15px rgba(255,215,0,0.5)",
                  "0 0 5px rgba(255,215,0,0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {genre.name}
            </motion.h3>
            <div className="space-y-3">
              {genre.competitions.map(
                (
                  competition:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined,
                  idx: React.Key | null | undefined
                ) => (
                  <motion.div
                    key={idx}
                    className="p-3 bg-gradient-to-r from-gray-900 to-blue-950 rounded-md text-white text-center relative overflow-hidden group/item border-l-4 border-blue-700 hover:border-yellow-500 transition-all duration-300"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <span className="font-medium text-lg relative z-10">
                      {competition}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 transform -skew-x-12 -translate-x-full group-hover/item:translate-x-0 transition-transform duration-700"></div>
                  </motion.div>
                )
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4 mb-6"></div>
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced FAQ Component
const FAQEnhanced: React.FC = () => {
  const faqData = [
    {
      question: "Who can participate in the competitions?",
      answer:
        "All students from recognized colleges and universities are eligible to participate. Some competitions may have specific eligibility criteria, which will be mentioned in their respective guidelines.",
    },
    {
      question: "Is there a registration fee?",
      answer:
        "Most competitions have a nominal registration fee that varies based on the event. Early bird registrations get special discounts. Check the specific competition page for details.",
    },
    {
      question: "Can I participate in multiple competitions?",
      answer:
        "Yes, you can register for multiple competitions as long as there are no schedule conflicts. We recommend checking the event timeline before registering.",
    },
    {
      question: "What are the prizes?",
      answer:
        "We have exciting cash prizes, trophies, certificates, and special recognition for winners. The total prize pool is over ₹500,000 across all competitions.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-12 text-yellow-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="space-y-6">
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-lg overflow-hidden shadow-lg border border-blue-800"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <motion.div
              className="p-6 cursor-pointer"
              whileHover={{ backgroundColor: "rgba(30, 58, 138, 0.4)" }}
            >
              <h3 className="text-xl font-bold mb-3 text-yellow-400 flex items-center">
                <span className="text-2xl mr-2">Q.</span>
                {item.question}
              </h3>
              <div className="pl-7 text-gray-300 border-l-2 border-yellow-600 ml-1">
                <p>{item.answer}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-gray-300 mb-6">
          Still have questions? Contact our team
        </p>
      </motion.div>
    </div>
  );
};

export default Competition;
