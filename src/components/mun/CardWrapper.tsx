"use client";

import { motion } from "framer-motion";
import Title from "./Title";

const CardWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="w-full"
    >
      <div
        className="
          w-full
          max-w-5xl
          mx-auto
          my-8
          p-5
          sm:p-8
          md:p-10
          bg-[#98C1D9]
          border
          border-[#3D5A80]
          rounded-xl
          transition-colors
          duration-300
          hover:border-[#EE6C4D]/70
        "
      >
        <Title text={title} />

        <div className="text-[#E0FBFC]">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default CardWrapper;