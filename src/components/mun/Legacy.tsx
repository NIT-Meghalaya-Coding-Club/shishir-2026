"use client";

import { NumberCounter } from "@/components/homepage/stats";
import Title from "./Title";
import { MUN_LegacyData } from "@/data/MUN_Legacy";
import { motion } from "framer-motion";
import Link from "next/link";

const LegacySection: React.FC = () => {
  const isCurrentYear = (year: string) => year === "2026";

  return (
    <section className="relative w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <Title text="Legacy" />

      {/* Legacy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.keys(MUN_LegacyData).map((year, index) => {
          const currentYear = isCurrentYear(year);

          return (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="relative h-full bg-[#98C1D9] border border-[#3D5A80] rounded-lg p-5 sm:p-6 transition-colors duration-300 group-hover:border-[#EE6C4D]/70">

                {/* Card Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="relative mt-1">
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E0FBFC]">
                        {year}
                      </h2>

                      <span className="absolute -bottom-1 left-0 h-[3px] w-12 bg-[#EE6C4D]" />
                    </div>
                  </div>

                  <span
                    className={`mt-1 text-xs uppercase tracking-[0.2em] ${
                      currentYear
                        ? "text-[#EE6C4D]"
                        : "text-[#98C1D9]/70"
                    }`}
                  >
                    {currentYear ? "Current" : "Edition"}
                  </span>
                </div>

                {/* Delegate Count / Registrations */}
                <div className="mt-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-[#E0FBFC]">
                      <NumberCounter
                        end={
                          currentYear
                            ? 300
                            : MUN_LegacyData[parseInt(year)].delegatesNo ?? 0
                        }
                      />
                    </span>

                    <span className="text-base sm:text-lg font-medium text-[#98C1D9]">
                      {currentYear ? "registrations" : "delegates"}
                    </span>
                  </div>

                  {/* Current Year Additional Text */}
                  {currentYear && (
                    <p className="mt-1 text-sm text-[#98C1D9]">
                      and counting...
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="mt-5 text-sm sm:text-base leading-7 text-[#E0FBFC]/80">
                  {currentYear
                    ? "Registration is ongoing! Join us for another spectacular conference."
                    : MUN_LegacyData[parseInt(year)].description}
                </p>

                {/* Register Button - Only for Current Year */}
                {currentYear && (
                  <div className="mt-6 pt-5 border-t border-[#3D5A80]/60">
                    <Link
                      href="/register"
                      className="inline-flex items-center border border-[#EE6C4D] px-4 py-2 rounded-md text-sm font-medium text-[#EE6C4D] transition-all duration-300 hover:bg-[#EE6C4D] hover:text-[#293241]"
                    >
                      Register Now
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default LegacySection;