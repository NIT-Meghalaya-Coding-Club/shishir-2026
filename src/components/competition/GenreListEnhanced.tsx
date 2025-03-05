import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Competition {
  name: string;
  competitions: {
    name: string;
    posterUrl: string;
    registerLink: string;
  }[];
}

export const GenreListEnhanced: React.FC<{ genres: Competition[] }> = ({ genres }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {genres.map((genre, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-lg overflow-hidden shadow-xl border border-blue-800 hover:border-yellow-500 transition-all duration-300 relative group"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{
            y: -5,
            boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 sm:w-20 h-16 sm:h-20 bg-yellow-500 rotate-45 opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <motion.h3
              className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 relative z-10 tracking-wider text-center mb-3 md:mb-4"
              animate={{
                textShadow: [
                  "0 0 5px rgba(255,215,0,0)",
                  "0 0 15px rgba(255,215,0,0.5)",
                  "0 0 5px rgba(255,215,0,0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {genre.name}
            </motion.h3>
            <div className="space-y-2 sm:space-y-3">
              {genre.competitions.map((competition, idx) => (
                <motion.div
                  key={idx}
                  className="bg-gradient-to-r from-gray-900 to-blue-950 rounded-md text-white relative overflow-hidden group/item border-l-4 border-blue-700 hover:border-yellow-500 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex flex-col sm:flex-row items-center p-2 sm:p-3">
                    {competition.posterUrl && (
                      <motion.div 
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md overflow-hidden flex-shrink-0 sm:mr-3 md:mr-4 mb-2 sm:mb-0 relative group/image"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Image 
                          src={competition.posterUrl || "/api/placeholder/120/120"}
                          alt={`${competition.name} poster`}
                          width={120}
                          height={120}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/api/placeholder/120/120";
                          }}
                        />
                        {/* Overlay effect on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                          <span className="transform scale-0 group-hover/image:scale-100 opacity-0 group-hover/image:opacity-100 transition-all duration-300">
                            <span className="text-white text-xs">View</span>
                          </span>
                        </div>
                      </motion.div>
                    )}
                    <div className="flex flex-col flex-grow">
                      <span className="font-medium text-base sm:text-lg relative z-10 text-center sm:text-left">
                        {competition.name}
                      </span>
                    </div>
                    
                    {/* Register button - adjusted for better mobile display */}
                    {competition.registerLink && (
                      <div className="mt-2 sm:mt-0 w-full sm:w-auto flex justify-center sm:justify-end sm:ml-auto">
                        <Link 
                          href={competition.registerLink}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs sm:text-sm font-bold py-1 sm:py-2 px-3 sm:px-4 rounded-md shadow-lg transition-colors duration-300 flex-shrink-0 z-20 relative"
                        >
                          Register
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 transform -skew-x-12 -translate-x-full group-hover/item:translate-x-0 transition-transform duration-700"></div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-2 sm:mt-4 mb-4 sm:mb-6"></div>
        </motion.div>
      ))}
    </div>
  );
};