"use client";

import { NumberCounter } from "@/components/homepage/stats";
import Title from "./Title";
import { MUN_LegacyData } from "@/data/MUN_Legacy";
import { motion } from "framer-motion";

const LegacySection: React.FC = () => {
  return (
    <section className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <Title text="Legacy" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Object.keys(MUN_LegacyData).map((year, index) => {
          const data =
            MUN_LegacyData[year as keyof typeof MUN_LegacyData];

          const displayYear =
            year === "2026-youth-parliament" ? "2026" : year;

          return (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              whileHover={{
                y: -8,
                scale: 1.015,
                transition: {
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="group relative"
            >
              {/* Scattered background light */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -inset-8
                  rounded-[2rem]
                  bg-[radial-gradient(circle_at_15%_20%,rgba(152,193,217,0.40),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(238,108,77,0.14),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(61,90,128,0.25),transparent_38%)]
                  opacity-0
                  blur-3xl
                  transition-opacity
                  duration-1000
                  ease-out
                  group-hover:opacity-75
                  dark:bg-[radial-gradient(circle_at_15%_20%,rgba(152,193,217,0.18),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(238,108,77,0.08),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(61,90,128,0.24),transparent_38%)]
                "
              />

              {/* Card */}
              <div
                className="
                  relative
                  h-full
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#3D5A80]/25
                  bg-white/40
                  p-6
                  shadow-[0_8px_25px_rgba(61,90,128,0.06)]
                  backdrop-blur-sm
                  transition-[box-shadow,border-color,background-color]
                  duration-700
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:border-[#3D5A80]/45
                  group-hover:shadow-[0_22px_55px_rgba(61,90,128,0.14)]
                  dark:border-[#98C1D9]/15
                  dark:bg-[#1D3452]/70
                  dark:shadow-[0_8px_25px_rgba(0,0,0,0.15)]
                  dark:group-hover:border-[#98C1D9]/25
                  dark:group-hover:shadow-[0_22px_55px_rgba(0,0,0,0.30)]
                  sm:p-7
                "
              >
                {/* Soft internal light */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_10%_10%,rgba(152,193,217,0.12),transparent_28%),radial-gradient(circle_at_90%_90%,rgba(238,108,77,0.06),transparent_30%)]
                    opacity-0
                    transition-opacity
                    duration-1000
                    ease-out
                    group-hover:opacity-100
                    dark:bg-[radial-gradient(circle_at_10%_10%,rgba(152,193,217,0.07),transparent_28%),radial-gradient(circle_at_90%_90%,rgba(238,108,77,0.04),transparent_30%)]
                  "
                />

                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#98C1D9]/10 dark:bg-[#98C1D9]/5" />

                {/* Header */}
                <div className="relative mb-8 flex items-start justify-between">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#3D5A80]/70 dark:text-[#98C1D9]/60">
                      {data.title}
                    </p>

                    <h2 className="text-4xl font-bold tracking-tight text-[#293241] dark:text-[#E0FBFC]">
                      {displayYear}
                    </h2>

                    <div className="mt-2 h-1 w-10 rounded-full bg-[#EE6C4D] transition-all duration-700 ease-out group-hover:w-16" />
                  </div>

                  {/* Edition badge */}
                  <span
                    className="
                      mt-1
                      rounded-full
                      border
                      border-[#3D5A80]/20
                      px-3
                      py-1
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-[#3D5A80]/70
                      dark:border-[#98C1D9]/15
                      dark:text-[#98C1D9]/60
                    "
                  >
                    Edition
                  </span>
                </div>

                {/* Delegates */}
                <div className="relative">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#293241] dark:text-[#E0FBFC]">
                      <NumberCounter end={data.delegatesNo ?? 0} />
                    </span>

                    <span className="text-sm font-medium text-[#3D5A80] dark:text-[#98C1D9]">
                      delegates
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="relative mt-6 text-sm leading-7 text-[#293241]/70 dark:text-[#E0FBFC]/70">
                  {data.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default LegacySection;