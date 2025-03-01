'use client'
import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();
  const [bounceEffect, setBounceEffect] = useState(false);
  const [funnyMessage, setFunnyMessage] = useState('');

  const funnyMessages = [
    "Oops! This party room doesn't exist!",
    "The DJ lost this track!",
    "This event took a wrong turn at Albuquerque!",
    "That ticket isn't valid for any of our awesome events!",
    "Even our staff couldn't find this page after a few drinks!",
    "This page is still in line at the VIP section!",
    "404: Event not found, but the after-party is still on!",
    "This page is fashionably late... actually, it's not coming at all.",
  ];

  // Randomly select a funny message on load and change it periodically
  useEffect(() => {
    setFunnyMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
    
    const interval = setInterval(() => {
      setFunnyMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
      setBounceEffect(true);
      setTimeout(() => setBounceEffect(false), 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Assume navbar height is approximately 80px
  const navbarHeight = 0;

  return ( 
    <div className='w-full min-h-screen flex flex-col justify-center items-center pt-24 pb-12 px-4'
         style={{ 
           background: 'radial-gradient(circle at center, #0A1128 0%, #001F54 60%, #000000 100%)',
           marginTop: navbarHeight + 'px', // Add margin to account for navbar
           fontFamily: "'Montserrat', sans-serif"
         }}>
      
      <div className='max-w-4xl w-full p-6 flex flex-col sm:flex-row gap-8 items-center justify-center'>
        <div className='backdrop-blur-md bg-black/40 rounded-xl p-8 text-center flex flex-col items-center shadow-2xl border border-gold-500' 
             style={{ borderColor: '#D4AF37' }}>
          <h1 className='text-4xl sm:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600'
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            404 EVENT MISSING
          </h1>
          
          <div className='mb-8 relative w-60 h-60'>
            <DotLottieReact
              src="/assets/404.lottie"
              loop
              autoplay
              className='object-cover absolute inset-0'
            />
          </div>
          
          <div className={`transition-all duration-300 mb-8 ${bounceEffect ? 'transform scale-110' : ''}`}>
            <h2 className='text-xl sm:text-2xl font-bold text-white'>
              {funnyMessage}
            </h2>
          </div>
          
          <div className='space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row'>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 text-lg font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md shadow-lg hover:shadow-gold transition-all duration-300"
              style={{ boxShadow: '0 4px 6px rgba(212, 175, 55, 0.3)' }}
            >
              Return to Main Event
            </button>
            
            <button
              onClick={() => router.push("/events")}
              className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-800 to-blue-900 rounded-md shadow-lg border border-gold-500 hover:bg-blue-700 transition-all duration-300"
              style={{ borderColor: '#D4AF37' }}
            >
              Browse Other Events
            </button>
          </div>
        </div>
        
        <div className='w-full sm:w-1/2 flex justify-center items-center'>
          <div className='relative w-full aspect-square max-w-md'>
            <DotLottieReact
              src="/assets/404_cat.lottie"
              loop
              autoplay
              className='object-cover absolute inset-0'
            />
            <div className='absolute -top-10 -right-10 bg-yellow-500 text-black p-3 rounded-full transform rotate-12 border-2 border-black font-bold text-xl'
                 style={{ 
                   backgroundColor: '#D4AF37',
                   animation: 'float 3s ease-in-out infinite'
                 }}>
              VIP Guest!
            </div>
          </div>
        </div>
      </div>
      
      
      
      {/* Gold accent elements */}
      <div className='fixed top-32 left-10 w-20 h-20 rounded-full opacity-20'
           style={{ 
             background: 'radial-gradient(circle, #D4AF37 0%, #AA8C2C 100%)',
             boxShadow: '0 0 30px 15px rgba(212, 175, 55, 0.4)',
             animation: 'pulse 4s ease-in-out infinite'
           }}>
      </div>
      
      <div className='fixed bottom-20 right-10 w-32 h-32 rounded-full opacity-20'
           style={{ 
             background: 'radial-gradient(circle, #D4AF37 0%, #AA8C2C 100%)',
             boxShadow: '0 0 30px 15px rgba(212, 175, 55, 0.4)',
             animation: 'pulse 6s ease-in-out infinite'
           }}>
      </div>
      
     
      
    </div>
  );
};

export default NotFoundPage;