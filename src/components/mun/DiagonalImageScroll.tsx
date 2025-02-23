'use client'
import React from 'react';
import Image from 'next/image';

const DiagonalImageScroll: React.FC = () => {
  const images = [
    { src: '/img/event/art-battle.png', width: 250, height: 250 },
    { src: '/img/event/shimmer.png', width: 250, height: 250 },
    { src: '/img/event/shimmer.png', width: 250, height: 250 }, 
  ];

  return (
    <div className="relative h-[650px] overflow-hidden z-50">
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute animate-diagonal-scroll"
          style={{
            animationDelay: `${index * 4}s`, // Stagger animation delay
          }}
        >
          <Image
            src={image.src}
            alt={`Image ${index + 1}`}
            width={image.width}
            height={image.height}
            className="rounded-xl shadow-2xl object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default DiagonalImageScroll;