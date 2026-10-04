
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

        {/* Background Glow */}
        <div
          className="
            pointer-events-none
            absolute
            -inset-6
            rounded-[2rem]
            bg-[#98C1D9]/20
            blur-3xl
            opacity-60
            transition-all duration-500
            group-hover:opacity-100
            group-hover:bg-[#98C1D9]/30
            dark:bg-[#3D5A80]/25
            dark:group-hover:bg-[#3D5A80]/40
          "
        />

        {/* Main Card */}
        <div
          className="
            relative
            z-10
            w-full
            overflow-hidden
            rounded-2xl
            border border-[#3D5A80]/25
            bg-white/40
            shadow-[0_20px_60px_rgba(61,90,128,0.12)]
            backdrop-blur-sm
            transition-all duration-500
            group-hover:-translate-y-1
            group-hover:border-[#3D5A80]/40
            group-hover:shadow-[0_25px_70px_rgba(61,90,128,0.18)]
            dark:border-[#98C1D9]/20
            dark:bg-[#293241]/40
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            dark:group-hover:border-[#98C1D9]/35
            dark:group-hover:shadow-[0_25px_70px_rgba(0,0,0,0.28)]
          "
        >
          {/* Inner Glow */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-72
              w-72
              -translate-x-1/2
              rounded-full
              bg-[#98C1D9]/15
              blur-3xl
              transition-all duration-700
              group-hover:bg-[#98C1D9]/25
              dark:bg-[#3D5A80]/20
              dark:group-hover:bg-[#3D5A80]/30
            "
          />

          {/* Content */}
          <div className="relative z-10 p-5 sm:p-8 md:p-10">
            <Title text={title} />

            <div className="mt-6 text-[#3D5A80] dark:text-[#E0FBFC]">
              {children}
            </div>
          </div>
 
        </div>
      </div>
    </motion.section>
  );
};

export default CardWrapper;