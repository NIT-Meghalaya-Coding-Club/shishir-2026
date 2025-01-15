'use client';
import React from 'react';
import { motion } from 'framer-motion'; // Correct import for Framer Motion
import event_categories from '@/data/categoryData';

export default function Inav() {
  const handleScroll = (category: string) => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="mt-[14vh] p-2 m-5 left-0 right-0 z-50 shadow-4xl rounded-xl">
      <nav className="container mx-auto flex flex-wrap justify-center gap-4 py-4">
        {event_categories.map((category, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => handleScroll(category)}
            className="cursor-pointer px-4 py-2 text-lg font-medium text-gray-700 hover:text-yellow-950 transition-colors duration-300 bg-white rounded-lg shadow-md"
          >
            {category.replace('_', ' ')}
          </motion.div>
        ))}
      </nav>
    </div>
  );
}