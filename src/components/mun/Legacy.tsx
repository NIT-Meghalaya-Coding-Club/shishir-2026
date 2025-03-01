'use client'
import { NumberCounter } from "@/components/homepage/stats";
import Title from "./Title";
import { MUN_LegacyData } from "@/data/MUN_Legacy";
import { motion } from "framer-motion";
import { FaCrown } from "react-icons/fa";
import Link from "next/link";


const LegacySection: React.FC = () => {
  const isCurrentYear = (year: string) => year === "2025";

  return (
    <div className="relative py-16">
      <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-repeat" />
      
      <Title text="Legacy" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        <FaCrown className="text-yellow-500 text-4xl animate-bounce" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.keys(MUN_LegacyData).map((year, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              key={year}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-yellow-900 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <div className="relative p-4 sm:p-6 lg:p-8 bg-gray-900/90 rounded-2xl border-2 border-yellow-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-500 rounded-tl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-500 rounded-tr" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-500 rounded-bl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-500 rounded-br" />

          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            {year}
          </h2>

          {isCurrentYear(year) ? (
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400">
            <NumberCounter end={200} />
            <span className="text-3xl sm:text-4xl"></span>
                </div>
                <div className="text-xl sm:text-2xl font-semibold text-yellow-400 animate-pulse">
            Registrations
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-semibold text-yellow-400 animate-pulse">
                and Counting...
              </div>
            </div>
          ) : (
            MUN_LegacyData[parseInt(year)].delegatesNo && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-yellow-400">
            <NumberCounter end={MUN_LegacyData[parseInt(year)].delegatesNo ?? 0} />
                </span>
                <span className="text-xl sm:text-2xl font-semibold text-yellow-400">Delegates</span>
              </div>
            )
          )}

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-200">
            {isCurrentYear(year) ? 
            "Registration is ongoing! Join us for another spectacular conference." :
            MUN_LegacyData[parseInt(year)].description
            }
          </p>
          {isCurrentYear(year) && (
            <div className="mt-8">
            <Link
              href="/register"
              className="inline-block px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-semibold text-white bg-yellow-500 rounded-lg shadow hover:bg-yellow-600 transition-colors"
            >
              Register Now
            </Link>
            </div>
          )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegacySection;