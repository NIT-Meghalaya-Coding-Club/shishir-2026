'use client'
import Image from 'next/image'
import Rbutton from './register-button' 
import { useState, useEffect } from 'react';

const ResponsiveScene = () => {
  const [bannerWidth, setBannerWidth] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 640) { // mobile
        setBannerWidth(400);
      } else if (width <= 1024) { // tablet
        setBannerWidth(600);
      } else if (width <= 1440) { // small desktop
        setBannerWidth(800);
      } else { // large desktop
        setBannerWidth(700);
      }
    };

    handleResize(); // Initial setup
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#0b101d]">
      {/* Main Scene Image */}
      <div className="relative w-full h-screen">
        <Image
          src="/img/img.gif"
          alt="Festival Scene"
          fill
          priority
          className="object-cover shadow-xl rounded-b-2xl"
          sizes="100vw"
          quality={100}
          
        />
      </div>

      {/* Centered Banner */}
      <div className="absolute top-16 md:top-16 lg:top-16 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-300">
        <div style={{ width: bannerWidth }}>
          <Image
            src="/img/banner.gif"
            alt="Shishir 2025"
            width={1000}
            height={250}
            priority
            
            className="w-full h-auto transition-all duration-300"
          />
        </div>
      </div>

      {/* Bottom Right Image */}
      <div className="absolute bottom-0 right-8">
        <div className=" rounded-full cursor-pointer hover:scale-105 transition-transform">
          <Rbutton/>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveScene;