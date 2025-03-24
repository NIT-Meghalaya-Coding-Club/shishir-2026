"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const SponsorAnnouncement = () => {
  // Sponsor data with multiple sponsors
  const sponsors = [
    {
      name: "Polo Orchid Resort, Cherrapunji",
      logo: "/sponsors/poloorchid.jpg",
      description: "Title Sponsor",
      tier: "Announcing Sponsor",
      color: {
        from: "#4A1C95",
        to: "#4169E1",
      },
    },
    // {
    //   name: "Green Horizon",
    //   logo: "/sponsors/greenhorizon.png",
    //   description: "Sustainability Meets Innovation",
    //   tier: "Eco Champion",
    //   color: {
    //     from: "#2ECC71",
    //     to: "#3498DB"
    //   }
    // },
    // {
    //   name: "Urban Dynamics",
    //   logo: "/sponsors/urbandynamics.png",
    //   description: "Reshaping Urban Experiences",
    //   tier: "Strategic Partner",
    //   color: {
    //     from: "#F39C12",
    //     to: "#8E44AD"
    //   }
    // }
  ];

  // State to manage current sponsor
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);

  // Cycle through sponsors
  const nextSponsor = () => {
    setCurrentSponsorIndex((prev) => (prev + 1) % sponsors.length);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const currentSponsor = sponsors[currentSponsorIndex];

  return (
    <div
      className="w-full"
      style={{
        background: `linear-gradient(to right, ${currentSponsor.color.from}, ${currentSponsor.color.to})`,
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full border-t-2 border-b-2 border-white/30"
      >
        {/* Animated Sponsor Showcase */}
        <div className="flex flex-col items-center px-4 md:px-8 py-8 bg-gradient-to-r from-black/80 via-black/60 to-black/80">
          {/* Sponsor Tier */}
          <motion.div
            className="flex items-center mb-4"
            variants={itemVariants}
          >
            <h2 className="font-bold text-3xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-[#d4a200] to-[#ffd960] mb-6 md:mb-8 special-font tracking-wider transform hover:scale-105 transition-transform duration-300 text-center">
              {currentSponsor.tier.toUpperCase()}
            </h2>
          </motion.div>

          {/* Sponsor Details */}
          <motion.div
            className="relative w-full max-w-3xl mx-auto mb-6"
            variants={itemVariants}
            key={currentSponsor.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center p-6 md:p-8 rounded-xl bg-black/70 border border-white/20">
              {/* Sponsor Logo */}
              <div className="w-48 h-48 md:w-56 md:h-56 mb-4 md:mb-0 md:mr-8 relative">
                <motion.div
                  className="absolute inset-0 rounded-full opacity-50 blur-xl"
                  style={{
                    background: `radial-gradient(circle, ${currentSponsor.color.from}, ${currentSponsor.color.to})`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <Image
                  src={currentSponsor.logo}
                  alt={currentSponsor.name}
                  fill
                  className="object-contain relative z-10 rounded-full"
                />
              </div>

              {/* Sponsor Description */}
              <div className="text-center md:text-left">
                <h3
                  className="text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: currentSponsor.color.to }}
                >
                  {currentSponsor.name}
                </h3>
                <motion.p
                  className="text-xl italic max-w-md relative z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "0.5rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Golden gradient background with animation */}
                  <motion.span
                    className="absolute inset-0 z-0"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(180, 83, 9, 0.3) 0%, rgba(245, 158, 11, 0.6) 50%, rgba(180, 83, 9, 0.3) 100%)",
                      filter: "blur(1px)",
                    }}
                    animate={{
                      background: [
                        "linear-gradient(90deg, rgba(180, 83, 9, 0.3) 0%, rgba(245, 158, 11, 0.6) 50%, rgba(180, 83, 9, 0.3) 100%)",
                        "linear-gradient(90deg, rgba(180, 83, 9, 0.4) 0%, rgba(245, 158, 11, 0.7) 50%, rgba(180, 83, 9, 0.4) 100%)",
                        "linear-gradient(90deg, rgba(180, 83, 9, 0.3) 0%, rgba(245, 158, 11, 0.6) 50%, rgba(180, 83, 9, 0.3) 100%)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Golden border effect */}
                  <motion.span
                    className="absolute inset-0 z-0"
                    style={{
                      borderRadius: "0.375rem",
                      padding: "1px",
                      background:
                        "linear-gradient(90deg, rgba(253, 230, 138, 0), rgba(253, 230, 138, 0.8), rgba(253, 230, 138, 0))",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />

                  {/* Text with glow effect */}
                  <span
                    className="relative z-10 text-white drop-shadow-md"
                    style={{
                      textShadow: "0 0 4px rgba(255, 215, 0, 0.3)",
                    }}
                  >
                    {currentSponsor.description}
                  </span>
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Sponsor Cycle Button */}
          <motion.button
            onClick={nextSponsor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 text-black font-medium rounded-full text-sm uppercase tracking-wider"
            style={{
              background: `linear-gradient(to right, ${currentSponsor.color.from}, ${currentSponsor.color.to})`,
              boxShadow: `0 0 15px ${currentSponsor.color.from}`,
            }}
          >
            Next Sponsor
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SponsorAnnouncement;
