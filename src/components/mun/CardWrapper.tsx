"use client";

import { motion } from "framer-motion";
import Title from "./Title";

const CardWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
      className="w-full px-4 sm:px-6"
    >
      <div className="group relative mx-auto my-8 w-full max-w-5xl">

        {/* Background scattered light */}
        <div
          className="
            pointer-events-none
            absolute
            -inset-12
            rounded-[3rem]
            bg-[radial-gradient(circle_at_15%_20%,rgba(152,193,217,0.45),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(238,108,77,0.15),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(61,90,128,0.28),transparent_35%)]
            opacity-0
            blur-3xl
            transition-opacity
            duration-1000
            ease-out
            group-hover:opacity-75
            dark:bg-[radial-gradient(circle_at_15%_20%,rgba(152,193,217,0.18),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(238,108,77,0.08),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(61,90,128,0.24),transparent_35%)]
          "
        />

        {/* Card */}
        <div
          className="
            relative
            z-10
            w-full
            overflow-hidden
            rounded-2xl
            border
            border-[#3D5A80]/25
            bg-white/40
            shadow-[0_8px_30px_rgba(61,90,128,0.08)]
            backdrop-blur-sm

            transition-[transform,box-shadow,border-color]
            duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover:-translate-y-2
            group-hover:scale-[1.008]
            group-hover:border-[#3D5A80]/45
            group-hover:shadow-[0_25px_60px_rgba(61,90,128,0.16)]

            dark:border-[#98C1D9]/15
            dark:bg-[#1D3452]/75
            dark:shadow-[0_8px_30px_rgba(0,0,0,0.18)]

            dark:group-hover:border-[#98C1D9]/30
            dark:group-hover:shadow-[0_25px_65px_rgba(0,0,0,0.32)]
          "
        >
          {/* Inner light */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_10%_15%,rgba(152,193,217,0.12),transparent_25%),radial-gradient(circle_at_90%_85%,rgba(238,108,77,0.07),transparent_25%)]
              opacity-0
              transition-opacity
              duration-1000
              ease-out
              group-hover:opacity-100
              dark:bg-[radial-gradient(circle_at_10%_15%,rgba(152,193,217,0.07),transparent_25%),radial-gradient(circle_at_90%_85%,rgba(238,108,77,0.04),transparent_25%)]
            "
          />

          <div className="relative z-10 p-5 sm:p-8 md:p-10">
            <Title text={title} />

            <div className="mt-6 text-[#293241] dark:text-[#E0FBFC]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CardWrapper;