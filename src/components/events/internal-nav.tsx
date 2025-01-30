'use client';
import React from 'react';
import { motion } from 'framer-motion';
import event_categories from '@/data/categoryData';

export default function Inav() {
  const handleScroll = (category: string) => {
    const element = document.getElementById(category.toLowerCase().replace(/ /g, '-'));
    if (element) {
      const offset = 100; // Adjust this value based on the height of your navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Duplicate the categories to create a seamless loop
  const duplicatedCategories = [...event_categories, ...event_categories];

  return (
    <div className="w-full mt-10 px-4 overflow-hidden">
      <nav className="flex gap-4 py-4">
        <div className="flex animate-infinite-scroll">
          {duplicatedCategories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => handleScroll(category)}
              className="flex-shrink-0 cursor-pointer px-6 py-3 text-lg font-medium text-gold-500 hover:text-gold-600 transition-colors duration-300 bg-black bg-opacity-50 rounded-lg shadow-lg border border-gold-500 hover:border-gold-600"
            >
              {category.replace('_', ' ')}
            </motion.div>
          ))}
        </div>
      </nav>
    </div>
  );
}