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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer mb-2 last:mb-0" // Added margin between items
      onClick={navigateTo}
    >
      <div className="relative h-12 flex items-center justify-center">
        <Image
          src="/assets/scroll-banner.webp"
          alt="Scroll Banner"
          layout="fill"
          priority
          quality={100}
          className="absolute inset-0 z-0"
        />
        <h1 className="text-lg font-medium text-black special-font relative z-10">
          {text}
        </h1>
      </div>
    </motion.li>
  );
};

export default NavBarItem;
