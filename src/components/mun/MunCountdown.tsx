"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-11-07T00:00:00");

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const countdownItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="w-full px-4 py-10 sm:px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="group relative mx-auto w-full max-w-5xl"
      >
        {/* Scattered background light */}
        <div
          className="
            pointer-events-none
            absolute
            -inset-10
            rounded-[2.5rem]
            bg-[radial-gradient(circle_at_15%_25%,rgba(152,193,217,0.45),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(238,108,77,0.18),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(61,90,128,0.30),transparent_38%)]
            opacity-0
            blur-3xl
            transition-opacity
            duration-1000
            ease-out
            group-hover:opacity-75
            dark:bg-[radial-gradient(circle_at_15%_25%,rgba(152,193,217,0.18),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(238,108,77,0.10),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(61,90,128,0.25),transparent_38%)]
          "
        />

        {/* Main card */}
        <div
          className="
            relative
            z-10
            overflow-hidden
            rounded-2xl
            border
            border-[#3D5A80]/25
            bg-white/40
            px-5
            py-8
            shadow-[0_8px_30px_rgba(61,90,128,0.08)]
            backdrop-blur-sm
            transition-[transform,box-shadow,border-color]
            duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:-translate-y-2
            group-hover:scale-[1.008]
            group-hover:border-[#3D5A80]/40
            group-hover:shadow-[0_22px_55px_rgba(61,90,128,0.15)]
            dark:border-[#98C1D9]/15
            dark:bg-[#1D3452]/75
            dark:shadow-[0_8px_30px_rgba(0,0,0,0.18)]
            dark:group-hover:border-[#98C1D9]/25
            dark:group-hover:shadow-[0_22px_55px_rgba(0,0,0,0.30)]
            sm:px-8
            md:px-10
          "
        >
          {/* Soft internal background light */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_12%_15%,rgba(152,193,217,0.12),transparent_28%),radial-gradient(circle_at_88%_85%,rgba(238,108,77,0.06),transparent_30%)]
              opacity-0
              transition-opacity
              duration-1000
              ease-out
              group-hover:opacity-100
              dark:bg-[radial-gradient(circle_at_12%_15%,rgba(152,193,217,0.07),transparent_28%),radial-gradient(circle_at_88%_85%,rgba(238,108,77,0.04),transparent_30%)]
            "
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            <Image
              src="/img/mun_logo.webp"
              alt="NITM MUN"
              width={90}
              height={90}
              className="
                mb-5
                rounded-lg
                transition-transform
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-105
              "
            />

            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#3D5A80] dark:text-[#98C1D9]">
              Youth Parliament 2026
            </p>

            <h2 className="text-2xl font-semibold text-[#EE6C4D] sm:text-3xl md:text-4xl">
              Shaping Tomorrow&apos;s Diplomatic Leaders
            </h2>

            <div className="mt-4 h-[2px] w-16 rounded-full bg-[#3D5A80] transition-all duration-700 ease-out group-hover:w-24" />

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#293241]/70 dark:text-[#E0FBFC]/75 sm:text-base">
              The countdown begins. Prepare to debate, negotiate, and represent
              your nation on the global stage.
            </p>
          </div>

          {/* Countdown numbers */}
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="relative z-10 mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5"
          >
            {countdownItems.map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="group/time text-center"
              >
                <div
                  className="
                    relative
                    flex
                    h-24
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#3D5A80]/20
                    bg-[#3D5A80]/5
                    transition-[transform,background-color,border-color,box-shadow]
                    duration-600
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    group-hover/time:-translate-y-1
                    group-hover/time:scale-[1.025]
                    group-hover/time:border-[#EE6C4D]/50
                    group-hover/time:bg-[#3D5A80]/10
                    group-hover/time:shadow-[0_10px_25px_rgba(61,90,128,0.10)]
                    dark:border-[#98C1D9]/15
                    dark:bg-[#98C1D9]/5
                    dark:group-hover/time:border-[#EE6C4D]/40
                    dark:group-hover/time:bg-[#98C1D9]/10
                    sm:h-28
                    md:h-32
                  "
                >
                  <span className="font-mono text-4xl font-semibold tabular-nums text-[#EE6C4D] sm:text-5xl">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-[#3D5A80] dark:text-[#98C1D9] sm:text-sm">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom section */}
          <div className="relative z-10 mt-9 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-medium text-[#293241] dark:text-[#E0FBFC]">
                November 7th, 2026
              </p>

              <p className="mt-1 text-xs text-[#3D5A80]/70 dark:text-[#98C1D9]">
                Join us for a transformative diplomatic experience.
              </p>
            </div>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfk-XqhkB_y0ysSaBbGVNwPwiKS6SNElQkEDeBTFF7-ZkQPLg/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="
                rounded-lg
                border
                border-[#EE6C4D]/70
                px-5
                py-2.5
                text-sm
                font-semibold
                text-[#EE6C4D]
                transition-[transform,background-color,color,box-shadow]
                duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:-translate-y-1
                hover:bg-[#EE6C4D]
                hover:text-white
                hover:shadow-[0_8px_20px_rgba(238,108,77,0.20)]
              "
            >
              Register Now
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CountdownTimer;