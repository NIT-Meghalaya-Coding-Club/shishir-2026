"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
      <div 
        className="relative h-12 flex items-center justify-center"
        style={{
          backgroundImage: "url('/assets/scroll-banner.png')", // Make sure to add the image to your public/assets folder
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}
      >
        <span className="text-sm font-medium text-black"> {/* Changed text color to black for better visibility on gold background */}
          {text}
        </span>
      </div>
    </motion.li>
  );
};

export default NavBarItem;