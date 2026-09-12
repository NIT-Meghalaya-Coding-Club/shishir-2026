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
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const targetDate = new Date('2026-11-05T10:30:00');

    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsComplete(false);
      } else {
        setIsComplete(true);
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
    <div className="w-full bg-slate-100 dark:bg-[#0a0a1a] transition-colors duration-300">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full border-t-2 border-b-2 border-yellow-500/30"
      >
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

        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-black dark:via-indigo-950/90 dark:to-black transition-colors duration-300">
          <motion.div 
            className="flex items-center mb-2 md:mb-0"
            variants={itemVariants}
          >
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
              className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-yellow-300 dark:to-amber-500"
              style={{ textShadow: "0 0 5px rgba(255,215,0,0.3)" }}
            >
              {isComplete ? "THE CELEBRATION HAS BEGUN!" : "COUNTDOWN BEGINS ..."}
            </h2>
          </motion.div>

          {isComplete ? (
            <motion.div
              variants={itemVariants}
              className="flex-1 text-center"
            >
              <motion.p
                className="text-sm md:text-base text-amber-700 dark:text-amber-100 font-medium"
                animate={{ 
                  scale: [1, 1.02, 1],
                  color: ["#B45309", "#D97706", "#B45309"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Join us in celebrating vibrant traditions and cultural heritage!
              </motion.p>
            </motion.div>
          ) : (
            <>
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
                  <p className="text-sm text-slate-700 dark:text-amber-100/90 font-medium dark:font-light italic">
                    Celebrating Vibrant Traditions and Cultural Heritage
                  </p>
                  <motion.div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                    animate={{ width: ["0%", "80%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>

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
                    className="flex flex-col items-center justify-center px-2 py-1 md:px-3 md:py-2 rounded-lg bg-white/90 dark:bg-gradient-to-b dark:from-indigo-900/80 dark:to-black/80 border border-yellow-500/30 shadow-sm dark:shadow-none"
                  >
                    <div
                      className="text-lg md:text-2xl font-bold text-amber-600 dark:text-amber-300"
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div 
                      className="text-xs md:text-sm text-slate-600 dark:text-blue-200/80 uppercase tracking-wider font-semibold"
                    >
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
        
        <motion.div 
          className="h-1 w-full bg-gradient-to-r from-indigo-900 via-black to-indigo-900"
        />
      </motion.div>
    </div>
  );
};

export default CountdownTimer;