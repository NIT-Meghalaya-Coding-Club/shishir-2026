'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function StickyRegisterButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link href="https://docs.google.com/forms/d/1vbrhrbnte5RRreJOnH3nQlgewDCuSv2aLWFw_czVg4c/edit?ts=67bde88f" target="_blank" rel="noopener noreferrer">
        <motion.div
          className="relative flex items-center justify-center
            h-16 w-16 md:h-20 md:w-20
            rounded-full bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600
            border-4 border-amber-300/80
            shadow-[0_0_15px_rgba(255,215,0,0.6)] hover:shadow-[0_0_25px_rgba(255,215,0,0.9)]
            cursor-pointer overflow-hidden"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9, rotate: -5 }}
          animate={{
            rotate: [0, 2, -2, 0],
            transition: { duration: 1.5, repeat: Infinity },
          }}
        >
          {/* Sparkling background effect */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,#fff_1px,transparent_1px)]
              [background-size:8px_8px] opacity-30"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Main text */}
          <motion.div
            className="flex flex-col items-center justify-center text-center z-10"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
          >
            <motion.span
              className="font-extrabold text-amber-100 text-base md:text-lg tracking-wider"
              animate={{
                textShadow: [
                  '0 0 5px rgba(255,215,0,0.8)',
                  '0 0 10px rgba(255,215,0,1)',
                  '0 0 5px rgba(255,215,0,0.8)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              JOIN
            </motion.span>
            <motion.span
              className="font-bold text-amber-50 text-sm md:text-base"
              animate={{ opacity: isHovered ? 1 : 0.8 }}
            >
              MUN &apos;25
            </motion.span>
          </motion.div>

          {/* Orbiting sparkles */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute w-2 h-2 bg-amber-300 rounded-full top-2 left-2 shadow-[0_0_8px_#ffd700]" />
            <div className="absolute w-2 h-2 bg-amber-200 rounded-full bottom-2 right-2 shadow-[0_0_8px_#ffd700]" />
          </motion.div>
        </motion.div>
      </Link>

      {/* Floating banner on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-14 right-0 whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-amber-600 to-yellow-500 text-amber-100 
              px-5 py-2 rounded-full flex items-center border-2 border-amber-300/50
              shadow-[0_0_10px_rgba(255,215,0,0.7)]">
              <motion.span
                className="font-semibold text-sm md:text-base"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                Register for NITM-MUN 2025
              </motion.span>
              <motion.span
                className="ml-2 text-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}