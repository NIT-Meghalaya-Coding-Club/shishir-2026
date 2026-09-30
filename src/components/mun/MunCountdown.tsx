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
    // Change this to your actual MUN 3.0 date
    const targetDate = new Date("2026-11-05T00:00:00");

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
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
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
    <section className="w-full max-w-5xl mx-auto py-10 px-4 sm:px-0">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative overflow-hidden rounded-xl border border-[#3D5A80] bg-[#98C1D9] px-5 py-8 sm:px-8 md:px-10"
      >
        {/* Small decorative line */}
        {/* <div className="absolute top-0 left-0 h-1 w-24 bg-[#EE6C4D]" /> */}

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/img/mun_logo.webp"
            alt="NITM MUN"
            width={90}
            height={90}
            className="mb-5 rounded-lg"
          />

          <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#98C1D9]">
            NIT Meghalaya Model United Nations
          </p>

          <h2 className="text-2xl font-semibold text-[#EE6C4D] sm:text-3xl md:text-4xl">
            Shaping Tomorrow&apos;s Diplomatic Leaders
          </h2>

          <div className="mt-4 h-[2px] w-16 bg-[#3D5A80]" />

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#E0FBFC]/75 sm:text-base">
            The countdown begins. Prepare to debate, negotiate, and represent
            your nation on the global stage.
          </p>
        </div>

        {/* Countdown */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
          className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5"
        >
          {countdownItems.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="group text-center"
            >
              <div className="relative flex h-24 items-center justify-center rounded-lg border border-[#3D5A80]/80 bg-[#3D5A80]/10 transition-colors duration-300 group-hover:border-[#EE6C4D]/70 group-hover:bg-[#3D5A80]/20 sm:h-28 md:h-32">
                <span className="font-mono text-4xl font-semibold tabular-nums text-[#EE6C4D] sm:text-5xl">
                  {String(item.value).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-[#98C1D9] sm:text-sm">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom information */}
        <div className="mt-9 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-medium text-[#E0FBFC]">
              November 5th, 2026
            </p>

            <p className="mt-1 text-xs text-[#98C1D9]">
              Join us for a transformative diplomatic experience.
            </p>
          </div>

          <a
            href="https://docs.google.com/forms/d/1vbrhrbnte5RRreJOnH3nQlgewDCuSv2aLWFw_czVg4c/edit?ts=67bde88f"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[#EE6C4D]/70 px-4 py-2 text-sm font-medium text-[#EE6C4D] transition-colors duration-300 hover:bg-[#EE6C4D] hover:text-[#293241]"
          >
            Register Now
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default CountdownTimer;