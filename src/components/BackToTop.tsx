"use client";

import { useEffect, useState } from "react";
import { RiArrowUpLine } from "@remixicon/react";

const BackToTop: React.FC = () => {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!showTopButton) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Go to top"
      className="fixed right-8 bottom-8 z-50 grid h-12 w-12 place-items-center rounded-full border-2 border-[#98C1D9] bg-[#3D5A80] text-xl text-[#E0FBFC] shadow-[0_0_12px_rgba(152,193,217,0.25)] transition-[transform,background-color,color] duration-300 hover:-translate-y-1 hover:bg-[#EE6C4D] hover:text-[#293241] max-sm:right-4 max-sm:bottom-[calc(4.5rem_+_env(safe-area-inset-bottom))]"
    >
      <RiArrowUpLine />
    </button>
  );
};

export default BackToTop;
