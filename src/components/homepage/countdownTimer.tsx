"use client"
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2025-04-04T00:00:00');

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  return (
    <div className="w-full" style={{ background: "linear-gradient(to right, #0a0a1a, #1a1a3a, #0a0a1a)" }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full border-t-2 border-b-2 border-yellow-500/30"
      >
        {/* Top decorative line */}
        <motion.div 
          className="h-1 w-full bg-gradient-to-r from-purple-900 via-amber-500 to-purple-900"
          animate={{ 
            background: [
              "linear-gradient(90deg, #4A1C95 0%, #FFD700 50%, #4A1C95 100%)",
              "linear-gradient(90deg, #4A1C95 25%, #FFD700 75%, #4A1C95 100%)",
              "linear-gradient(90deg, #4A1C95 0%, #FFD700 50%, #4A1C95 100%)",
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 bg-gradient-to-r from-black via-indigo-950/90 to-black">
          {/* Title section */}
          <motion.div 
            className="flex items-center mb-2 md:mb-0"
            variants={itemVariants}
          >
            {/* Small crown icon */}
            <motion.div
              animate={{
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mr-3 hidden md:block"
            >
              <Image 
              src="/assets/logo.png" 
              alt="Custom Icon" 
              width={50} 
              height={50} 
              className="object-contain"
              />
            </motion.div>
            
            <h2 
              className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500"
              style={{ textShadow: "0 0 5px rgba(255,215,0,0.5)" }}
            >
              COUNTDOWN BEGINS ...
            </h2>
          </motion.div>

          {/* Center subtitle */}
          <motion.div
            variants={itemVariants}
            className="hidden md:block flex-1 text-center"
          >
            <motion.div
              className="relative inline-block px-6"
              animate={{
                filter: [
                  "drop-shadow(0 0 2px rgba(255,215,0,0.3))",
                  "drop-shadow(0 0 5px rgba(255,215,0,0.6))",
                  "drop-shadow(0 0 2px rgba(255,215,0,0.3))",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-sm text-amber-100/90 font-light italic">
                Celebrating Vibrant Traditions and Cultural Heritage
              </p>
              
              {/* Animated underline */}
              <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                animate={{ width: ["0%", "80%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Countdown section */}
          <motion.div 
            variants={containerVariants}
            className="flex space-x-3 md:space-x-6"
          >
            {[
              { label: 'D', value: timeLeft.days },
              { label: 'H', value: timeLeft.hours },
              { label: 'M', value: timeLeft.minutes },
              { label: 'S', value: timeLeft.seconds }
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 10px rgba(255,215,0,0.3)"
                }}
                className="flex flex-col items-center justify-center px-2 py-1 md:px-3 md:py-2 rounded-lg bg-gradient-to-b from-indigo-900/80 to-black/80 border border-yellow-500/20"
              >
                {/* Number */}
                <div
                  className="text-lg md:text-2xl font-bold text-amber-300"
                  style={{ textShadow: "0 0 5px rgba(0,0,0,0.8)" }}
                >
                  {String(item.value).padStart(2, '0')}
                </div>
                
                {/* Label */}
                <div 
                  className="text-xs md:text-sm text-blue-200/80 uppercase tracking-wider"
                >
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CTA button */}
          {/* <motion.button
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 10px rgba(255,215,0,0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:block ml-6 px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-medium rounded-full text-sm uppercase tracking-wider shadow-md"
            style={{
              boxShadow: "0 0 6px rgba(255,215,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4)"
            }}
          >
            Join Us
          </motion.button> */}
        </div>
        
        {/* Bottom decorative line */}
        <motion.div 
          className="h-1 w-full bg-gradient-to-r from-indigo-900 via-black to-indigo-900"
        />
      </motion.div>
    </div>
  );
};

export default CountdownTimer;