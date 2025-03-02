'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const artists = [
  {
    id: 1,
    name: 'DJ Nebula',
    genre: 'Electronic / House',
    image: '/api/placeholder/400/400',
    color: '#FF5E5B'
  },
  {
    id: 2,
    name: 'The Cosmic Beats',
    genre: 'Alternative Rock',
    image: '/api/placeholder/400/400',
    color: '#22BABB'
  },
  {
    id: 3,
    name: 'Luna Echo',
    genre: 'Indie Pop',
    image: '/api/placeholder/400/400',
    color: '#9B5DE5'
  },
  {
    id: 4,
    name: 'Rhythm Raiders',
    genre: 'Hip Hop / Rap',
    image: '/api/placeholder/400/400',
    color: '#F15BB5'
  },
  {
    id: 5,
    name: 'Mystic Sound',
    genre: 'World Fusion',
    image: '/api/placeholder/400/400',
    color: '#00BBF9'
  }
];

const FeaturedArtists = () => {
  const [activeArtist, setActiveArtist] = useState<number | null>(null);

  return (
    <div className="w-full bg-gray-900 py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              background: `${artists[i % 5].color}`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              scale: [1, Math.random() * 0.5 + 0.8, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Header with animated gradient text */}
      <motion.div 
        className="relative z-10 text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 inline-block">
          Featured Artists
        </h2>
        <motion.div 
          className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "linear" 
          }}
          style={{ backgroundSize: '200% 200%' }}
        />
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
          Experience the incredible lineup at NITM&apos;s Cultural Fest this year!
        </p>
      </motion.div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 relative z-10">
        {artists.map((artist) => (
          <motion.div
            key={artist.id}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
            whileHover={{ 
              scale: 1.05,
              zIndex: 20,
              boxShadow: `0 0 30px ${artist.color}` 
            }}
            onClick={() => setActiveArtist(activeArtist === artist.id ? null : artist.id)}
            layout
          >
            <motion.div 
              className="absolute inset-0 opacity-60"
              style={{ backgroundColor: artist.color }}
              whileHover={{ opacity: 0.8 }}
            />
            
            <div className="aspect-square">
              <Image 
              src={artist.image} 
              alt={artist.name}
              layout="fill"
              objectFit="cover"
              />
            </div>
            
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-60 backdrop-blur-md"
              whileHover={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <h3 className="text-xl font-bold text-white">{artist.name}</h3>
              <p className="text-gray-200 text-sm">{artist.genre}</p>
              
              <AnimatePresence>
                {activeArtist === artist.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <p className="text-gray-300 text-sm">
                      Don&apos;t miss the electrifying performance by {artist.name} at this year&apos;s cultural fest!
                      Bringing their unique {artist.genre} style to the main stage.
                    </p>
                    <motion.button
                      className="mt-4 px-4 py-2 rounded-full text-sm font-semibold"
                      style={{ backgroundColor: artist.color }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Schedule
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Animated call to action */}
      <motion.div
        className="mt-12 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-bold text-lg"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(131, 56, 236, 0.7)" }}
          whileTap={{ scale: 0.95 }}
        >
          Book Tickets Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FeaturedArtists;