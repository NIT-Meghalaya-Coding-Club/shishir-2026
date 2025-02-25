"use client"
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
    const targetDate = new Date('2025-04-05T00:00:00');

    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }
  };

  return (
    <div className="relative w-full min-h-[400px] flex flex-col items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-yellow-500/20"
      >
        
        <div className="flex justify-center mb-6">
          <Image src="/img/mun_logo.png" alt="Conference" width={100} height={100} className=" rounded-lg " />
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-yellow-400 font-semibold mb-4">
          Shaping Tomorrow&apos;s Diplomatic Leaders
        </h2>

        <div className="w-24 h-0.5 bg-yellow-500/50 mx-auto mb-8" />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 lg:gap-12 justify-center">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="flex flex-col items-center"
            >
              <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white/5 backdrop-blur-lg rounded-lg flex items-center justify-center shadow-xl border border-yellow-500/20"
              >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-lg" />
          <span className="text-3xl md:text-4xl lg:text-5xl font-semibold text-yellow-400 relative z-10 font-mono">
            {String(item.value).padStart(2, '0')}
          </span>
              </motion.div>
              <span className="mt-3 text-sm md:text-base lg:text-lg text-yellow-100 font-medium uppercase tracking-wider">
          {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a 
            href="https://example.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-yellow-100/80 rounded-lg text-sm md:text-base backdrop-blur-sm py-2 px-4 bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors"
          >
            April 5th, 2025 | Join us for this transformative event
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default CountdownTimer;