
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
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
      className="w-full px-4 sm:px-6"
    >
      <div className="group relative mx-auto my-8 w-full max-w-5xl" style={{ contain: "layout style" }}>

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
            transition-colors duration-500
            dark:border-[#98C1D9]/20
            dark:bg-[#293241]/40
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.18)]
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
              dark:bg-[#3D5A80]/20
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