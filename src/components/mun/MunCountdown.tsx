"use client";

import { motion, type Variants } from "framer-motion";
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

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
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
        {/* Background glow */}
        <div
          className="
            pointer-events-none absolute
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
            relative overflow-hidden
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
          {/* Inner glow */}
          <div
            className="
              pointer-events-none absolute
              left-1/2 top-0
              h-72 w-72
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

          <div className="relative px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">

            {/* Logo — no round container */}
            <motion.div
              variants={itemVariants}
              className="
                mb-5
                flex justify-center
              "
            >
              <Image
                src="/img/mun_logo.webp"
                alt="NITM MUN Logo"
                width={75}
                height={75}
                className="
                  object-contain
                  transition-transform duration-500
                  group-hover:scale-105
                "
              />
            </motion.div>

            {/* Heading */}
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <p
                className="
                  mb-2
                  text-xs font-semibold uppercase
                  tracking-[0.25em]
                  text-[#3D5A80]
                  dark:text-[#98C1D9]
                "
              >
                Youth Parliament 2026
              </p>

              <h2
                className="
                  text-2xl font-bold
                  tracking-tight
                  text-[#3D5A80]
                  sm:text-3xl
                  md:text-4xl
                  dark:text-[#E0FBFC]
                "
              >
                Shaping Tomorrow&apos;s{" "}
                <span
                  className="
                    text-[#EE6C4D]
                    transition-colors duration-300
                    group-hover:text-[#d95d45]
                  "
                >
                  Diplomatic Leaders
                </span>
              </h2>

              <div
                className="
                  mx-auto mt-4
                  h-px w-24
                  bg-[#EE6C4D]
                  dark:bg-[#98C1D9]
                "
              />

              <p
                className="
                  mx-auto mt-5
                  max-w-2xl
                  text-sm leading-6
                  text-[#3D5A80]/80
                  sm:text-base
                  dark:text-[#E0FBFC]/75
                "
              >
                Step into the world of diplomacy, leadership, and
                meaningful debate. Get ready to raise your voice,
                represent your ideas, and shape the conversations
                that matter.
              </p>
            </motion.div>

            {/* Countdown */}
            <motion.div
              variants={itemVariants}
              className="
                mt-8
                grid grid-cols-2 gap-3
                sm:mt-10 sm:grid-cols-4 sm:gap-4
              "
            >
              {countdownItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{
                    y: -5,
                    scale: 1.03,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="
                    group/item relative overflow-hidden
                    rounded-xl
                    border border-[#3D5A80]/20
                    bg-[#E0FBFC]/35
                    px-3 py-5
                    text-center
                    shadow-[0_8px_25px_rgba(61,90,128,0.07)]
                    transition-all duration-300
                    hover:border-[#EE6C4D]/45
                    hover:bg-[#E0FBFC]/60
                    hover:shadow-[0_12px_30px_rgba(238,108,77,0.14)]
                    dark:border-[#98C1D9]/20
                    dark:bg-[#293241]/35
                    dark:hover:border-[#EE6C4D]/40
                    dark:hover:bg-[#293241]/55
                  "
                >
                  <div
                    className="
                      absolute left-1/2 top-0
                      h-[3px] w-8
                      -translate-x-1/2
                      rounded-b-full
                      bg-[#EE6C4D]
                      transition-all duration-300
                      group-hover/item:w-14
                    "
                  />

                  <div
                    className="
                      text-3xl font-bold
                      tabular-nums
                      text-[#3D5A80]
                      transition-colors duration-300
                      group-hover/item:text-[#EE6C4D]
                      sm:text-4xl
                      dark:text-[#E0FBFC]
                      dark:group-hover/item:text-[#EE6C4D]
                    "
                  >
                    {String(item.value).padStart(2, "0")}
                  </div>

                  <div
                    className="
                      mt-1
                      text-[10px] font-semibold
                      uppercase tracking-[0.18em]
                      text-[#3D5A80]/60
                      transition-colors duration-300
                      group-hover/item:text-[#3D5A80]
                      sm:text-xs
                      dark:text-[#98C1D9]
                    "
                  >
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom */}
            <motion.div
              variants={itemVariants}
              className="
                mt-8
                flex flex-col items-center
                justify-between gap-5
                border-t border-[#3D5A80]/15
                pt-6
                sm:flex-row
                dark:border-[#98C1D9]/20
              "
            >
              <div className="text-center sm:text-left">
                <p
                  className="
                    text-xs font-medium uppercase
                    tracking-[0.16em]
                    text-[#3D5A80]/55
                    dark:text-[#98C1D9]
                  "
                >
                  The countdown ends on
                </p>

                <p
                  className="
                    mt-1
                    text-sm font-semibold
                    text-[#3D5A80]
                    dark:text-[#E0FBFC]
                  "
                >
                  07 November 2026
                </p>
              </div>

              {/* Register */}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfk-XqhkB_y0ysSaBbGVNwPwiKS6SNElQkEDeBTFF7-ZkQPLg/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center
                  rounded-full
                  border border-[#EE6C4D]
                  bg-[#EE6C4D]
                  px-6 py-2.5
                  text-sm font-semibold
                  text-white
                  shadow-[0_8px_20px_rgba(238,108,77,0.20)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:scale-[1.03]
                  hover:bg-[#d95d45]
                  hover:shadow-[0_12px_28px_rgba(238,108,77,0.30)]
                  active:translate-y-0
                  active:scale-[0.98]
                "
              >
                Register Now
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CountdownTimer;