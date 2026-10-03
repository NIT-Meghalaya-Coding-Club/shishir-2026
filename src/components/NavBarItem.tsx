"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Props {
  to: string;
  text: string;
  onClick: () => void;
}

import localFont from 'next/font/local';

const samanFont = localFont({
  src: '../app/fonts/saman_font.ttf',
  display: 'swap',
});

/**
 * One rolled end of the scroll. A see-through glass cylinder with
 * a bright edge highlight, a soft core, and an elliptical cap on top and bottom.
 */
const GlassRoll: React.FC<{ side: "left" | "right" }> = ({ side }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute inset-y-0 z-[4] w-4 ${
      side === "left" ? "left-0" : "right-0"
    }`}
  >
    {/* cylinder body */}
    <span
      className="
        absolute inset-0 rounded-[50%/9px]
        border border-white/60
        bg-[linear-gradient(90deg,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.08)_32%,rgba(255,255,255,0.22)_68%,rgba(255,255,255,0.6)_100%)]
        shadow-[inset_0_0_6px_rgba(255,255,255,0.55),0_4px_10px_rgba(40,70,130,0.18)]
        backdrop-blur-md
      "
    />
    {/* vertical specular streak */}
    <span className="absolute inset-y-2 left-[28%] w-[2px] rounded-full bg-white/80 blur-[0.5px]" />
    {/* top cap */}
    <span className="absolute inset-x-[1px] top-0 h-[10px] rounded-[50%] border border-white/80 bg-white/30 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.25)]" />
    {/* bottom cap */}
    <span className="absolute inset-x-[1px] bottom-0 h-[10px] rounded-[50%] border border-white/70 bg-white/20 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2)]" />
  </span>
);

const NavBarItem: React.FC<Props> = ({ to, text, onClick }) => {
  const router = useRouter();

  const navigateTo = () => {
    router.push(to);
    onClick();
  };

  return (
    <motion.li
      role="link"
      tabIndex={0}
      onClick={navigateTo}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigateTo();
        }
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="
        group relative mb-2 h-12 cursor-pointer list-none rounded-lg
        outline-none last:mb-0
        focus-visible:ring-2 focus-visible:ring-white/80
      "
    >
      {/* paper of the scroll: tucked between the two rolls */}
      <span
        aria-hidden
        className="
          absolute inset-y-[5px] left-2 right-2 z-[1] overflow-hidden rounded-[3px]
          border-y border-white/70
          bg-[linear-gradient(180deg,rgba(255,255,255,0.38)_0%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.24)_100%)]
          shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(255,255,255,0.4),0_8px_18px_rgba(40,70,130,0.18)]
          backdrop-blur-md backdrop-saturate-150
          transition-all duration-300
          group-hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.14)_50%,rgba(255,255,255,0.32)_100%)]
          dark:border-white/30
          dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.1)_100%)]
        "
      >
        {/* thin inner pinstripes, like the silver lines on the blue banner */}
        <span className="absolute inset-x-0 top-[3px] h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
        <span className="absolute inset-x-0 bottom-[3px] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

        {/* static glossy reflection across the upper-left */}
        <span className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.12)_38%,rgba(255,255,255,0)_55%)]" />

        {/* sliding shine on hover */}
        <span
          className={
            `absolute inset-y-0 left-0 w-1/3 -translate-x-[150%] skew-x-[-20deg]
            bg-gradient-to-r from-transparent via-white/60 to-transparent
            transition-transform duration-700 ease-in-out
            group-hover:translate-x-[400%]
            motion-reduce:transition-none`
          }
        />
      </span>

      <GlassRoll side="left" />
      <GlassRoll side="right" />

      {/* label */}
      <span className="relative z-[5] flex h-full items-center justify-center px-6">
        <span
          className={`${samanFont.className} font-bold text-xl text-slate-900
            drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]
            transition-all duration-300
            group-hover:scale-105 group-hover:tracking-wider
            dark:text-white dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]`}
        >
          {text}
        </span>
      </span>
    </motion.li>
  );
};

export default NavBarItem;