"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  to: string;
  text: string;
  onClick: () => void;
}

const NavBarItem: React.FC<Props> = ({ to, text, onClick }) => {
  const router = useRouter();

  const navigateTo = () => {
    router.push(to);
    onClick();
  };

  return (
    <motion.li
      onClick={navigateTo}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
      className="group relative mb-2 cursor-pointer overflow-hidden rounded-lg last:mb-0"
    >
      <motion.div
        className="relative h-12 flex items-center justify-center"
      >
        <Image
          src="/assets/scroll-banner.webp"
          alt="Scroll Banner"
          fill
          priority
          quality={100}
          style={{ objectFit: "cover" }}
          className="
            absolute inset-0 z-0
            transition-transform duration-500
            group-hover:scale-110
          "
        />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-[1] bg-white/15 dark:bg-black/15"
        />

        {/* Sliding shine */}
        <motion.div
          initial={{ x: "-120%" }}
          whileHover={{ x: "120%" }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="
            absolute inset-y-0 z-[2]
            w-1/3
            bg-gradient-to-r
            from-transparent
            via-white/30
            to-transparent
            skew-x-[-20deg]
          "
        />

        <h1
          className="
            relative z-[3]
            text-lg font-medium
            text-black
            special-font
            transition-all duration-300
            group-hover:tracking-wider
            group-hover:scale-105
          "
        >
          {text}
        </h1>
      </motion.div>
    </motion.li>
  );
};

export default NavBarItem; 