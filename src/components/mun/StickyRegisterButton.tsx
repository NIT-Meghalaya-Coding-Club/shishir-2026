"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function StickyRegisterButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8">
      <Link
        href="https://docs.google.com/forms/d/e/1FAIpQLSfk-XqhkB_y0ysSaBbGVNwPwiKS6SNElQkEDeBTFF7-ZkQPLg/viewform?usp=header"
        target="_blank"
        rel="noopener noreferrer"
      >
        <motion.div
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileTap={{ scale: 0.94 }}
          animate={{ rotate: 360 }}
          transition={{
            rotate: {
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className="group relative"
        >
          {/* Soft background */}
          <div
            className="
              pointer-events-none
              absolute
              -inset-3
              rounded-full
              bg-[#EE6C4D]/10
              opacity-70
              blur-xl
              transition-all
              duration-700
              group-hover:bg-[#EE6C4D]/20
              group-hover:opacity-100

              dark:bg-[#FF8A6B]/10
              dark:group-hover:bg-[#FF8A6B]/20
            "
          />

          {/* Button */}
          <div
            className="
              relative
              flex
              h-[88px]
              w-[88px]
              items-center
              justify-center
              overflow-hidden
              rounded-full

              border
              border-[#EE6C4D]/40
              bg-white

              shadow-[0_8px_25px_rgba(238,108,77,0.18)]

              transition-all
              duration-500

              group-hover:border-[#EE6C4D]/70
              group-hover:shadow-[0_12px_32px_rgba(238,108,77,0.28)]

              dark:border-[#FF8A6B]/45
              dark:bg-[#172B46]
              dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)]
              dark:group-hover:border-[#FF8A6B]/75
              dark:group-hover:shadow-[0_12px_32px_rgba(255,138,107,0.18)]

              sm:h-[94px]
              sm:w-[94px]
            "
          >
            {/* Inner ring */}
            <div
              className="
                pointer-events-none
                absolute
                inset-2
                rounded-full
                border
                border-[#EE6C4D]/15

                dark:border-[#FF8A6B]/20
              "
            />

            {/* Moving shine */}
            <motion.div
              initial={{ x: "-150%" }}
              animate={{ x: "150%" }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
              }}
              className="
                pointer-events-none
                absolute
                inset-y-[-20%]
                w-7
                rotate-[25deg]
                bg-[#EE6C4D]/10
                blur-md

                dark:bg-[#FF8A6B]/10
              "
            />

            {/* Button content */}
            <div className="relative z-10 flex flex-col items-center leading-none">
              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.22em]
                  text-[#EE6C4D]/70

                  dark:text-[#FF8A6B]/75
                "
              >
                Join
              </span>

              <span
                className="
                  mt-1
                  text-xl
                  font-bold
                  tracking-wide
                  text-[#EE6C4D]

                  dark:text-[#FF8A6B]
                "
              >
                MUN
              </span>

              <span
                className="
                  mt-1
                  text-[9px]
                  font-medium
                  tracking-[0.2em]
                  text-[#EE6C4D]/70

                  dark:text-[#FF8A6B]/75
                "
              >
                2026
              </span>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Hover message */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              x: 8,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              x: 8,
              y: 10,
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              pointer-events-none
              absolute
              bottom-[108px]
              right-0
              origin-bottom-right
            "
          >
            {/* Message */}
            <div
              className="
                relative
                overflow-hidden
                whitespace-nowrap
                rounded-xl

                border
                border-[#EE6C4D]/35
                bg-white

                px-4
                py-3

                shadow-[0_10px_30px_rgba(238,108,77,0.16)]

                dark:border-[#FF8A6B]/45
                dark:bg-[#172B46]
                dark:shadow-[0_10px_30px_rgba(0,0,0,0.30)]
              "
            >
              {/* Subtle shine */}
              <motion.div
                initial={{ x: "-120%" }}
                animate={{ x: "140%" }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  repeatDelay: 1.8,
                  ease: "easeInOut",
                }}
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  w-8
                  skew-x-[-20deg]
                  bg-[#EE6C4D]/8
                  blur-sm

                  dark:bg-[#FF8A6B]/10
                "
              />

              <span
                className="
                  relative
                  z-10
                  text-sm
                  font-semibold
                  tracking-wide
                  text-[#EE6C4D]

                  dark:text-[#FF8A6B]
                "
              >
                Click to Register for NITM MUN 2026
              </span>
            </div>

            {/* Connector */}
            <div
              className="
                absolute
                -bottom-1.5
                right-8
                h-3
                w-3
                rotate-45

                border-b
                border-r
                border-[#EE6C4D]/35
                bg-white

                dark:border-[#FF8A6B]/45
                dark:bg-[#172B46]
              "
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}