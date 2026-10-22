"use client";

import React from "react";

interface MenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

const bar =
  "block h-[3px] w-6 rounded-full bg-[#293241] transition-all duration-300 group-hover:bg-[#EE6C4D]";

const MenuToggle: React.FC<MenuToggleProps> = ({ isOpen, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="group flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full transition-colors duration-300 hover:bg-[#E0FBFC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EE6C4D] sm:h-11 sm:w-11"
    >
      <span className={`${bar} ${isOpen ? "translate-y-[8px] rotate-45" : ""}`} />
      <span className={`${bar} ${isOpen ? "opacity-0" : ""}`} />
      <span className={`${bar} ${isOpen ? "-translate-y-[8px] -rotate-45" : ""}`} />
    </button>
  );
};

export default MenuToggle;