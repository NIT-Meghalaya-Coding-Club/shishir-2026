"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function StickyRegisterButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8">
      <Link
        href="https://docs.google.com/forms/d/1vbrhrbnte5RRreJOnH3nQlgewDCuSv2aLWFw_czVg4c/edit?ts=67bde88f"
        target="_blank"
        rel="noopener noreferrer"
      >
        <motion.div
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="
            relative
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            border
            border-[#3D5A80]
            bg-[#293241]
            shadow-[0_8px_25px_rgba(0,0,0,0.35)]
            transition-colors
            duration-300
            hover:border-[#98C1D9]
          "
        >
          {/* Small accent */}
          {/* <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#EE6C4D]" /> */}

          <div className="flex flex-col items-center justify-center leading-none">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#98C1D9]">
              Join
            </span>

            {/* <span className="mt-1 text-sm font-semibold text-[#E0FBFC]">
              MUN
            </span> */}

            {/* <span className="mt-1 text-[9px] tracking-[0.15em] text-[#3D5A80]">
              2026
            </span> */}
          </div>
        </motion.div>
      </Link>

      {/* Hover Label */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className="
              absolute
              right-[76px]
              top-1/2
              -translate-y-1/2
              whitespace-nowrap
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                rounded-md
                border
                border-[#3D5A80]
                bg-[#293241]
                px-4
                py-2.5
                shadow-[0_8px_25px_rgba(0,0,0,0.3)]
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#EE6C4D]" />

              <span className="text-sm font-medium text-[#E0FBFC]">
                Register for NITM MUN 2026
              </span>

              <span className="text-[#98C1D9]">→</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}