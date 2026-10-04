"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Inav({ categories }: { categories: string[] }) {
  const handleScroll = (category: string) => {
    const element = document.getElementById(
      category.toLowerCase().replace(/ /g, "-"),
    );
    if (element) {
      const offset = 100; // Adjust this value based on the height of your navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Duplicate the categories to create a seamless loop
  const duplicatedCategories = [...categories, ...categories];

  return (
    <div className="w-full mt-10 px-4 overflow-hidden">
      <nav className="flex gap-4 py-4">
        <div className="flex animate-infinite-scroll">
          {duplicatedCategories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleScroll(category)}
              className="flex-shrink-0 cursor-pointer px-6 py-3 text-lg font-medium text-[#EE6C4D] hover:text-[#E0FBFC] transition-colors duration-300 bg-[#E0FBFC]/70 dark:bg-[#293241]/70 backdrop-blur-sm rounded-full shadow-lg border border-[#EE6C4D]/80 hover:border-[#EE6C4D] hover:bg-[#EE6C4D]"
            >
              {category.replace("_", " ")}
            </motion.div>
          ))}
        </div>
      </nav>
    </div>
  );
}
