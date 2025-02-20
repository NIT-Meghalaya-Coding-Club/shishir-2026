import React from 'react';
import { motion } from 'framer-motion';

interface Genre {
  name: string;
  competitions: string[];
}

interface GenreListProps {
  genres: Genre[];
}

export const GenreList: React.FC<{ genres: any[] }> = ({ genres }) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="px-8 pt-8 pb-4">
            <div
              className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-yellow-500 rotate-45 opacity-20 
                          group-hover:opacity-40 transition-opacity duration-300"
            ></div>
            <motion.h3
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 relative z-10 tracking-wider text-center mb-4"
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
            <div className="space-y-3">
              {genre.competitions.map(
                (
                  competition:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined,
                  idx: React.Key | null | undefined
                ) => (
                  <motion.div
                    key={idx}
                    className="p-3 bg-gradient-to-r from-gray-900 to-blue-950 rounded-md text-white text-center relative overflow-hidden group/item border-l-4 border-blue-700 hover:border-yellow-500 transition-all duration-300"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <span className="font-medium text-lg relative z-10">
                      {competition}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 transform -skew-x-12 -translate-x-full group-hover/item:translate-x-0 transition-transform duration-700"></div>
                  </motion.div>
                )
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4 mb-6">
          </div>
        </motion.div>
      ))}
    </div>
  );
};