'use client';
import React from 'react';

export const Outro: React.FC = () => {
  return (
    <section className="w-screen h-screen flex justify-center items-center bg-black relative z-[5]">
      <div className="text-center p-8 md:p-12 flex flex-col items-center gap-3 md:gap-4 max-w-5xl">
        <h1 className="fire-text-flow text-[clamp(4.2rem,12vw,8.5rem)] font-[900] uppercase tracking-[-0.01em] leading-[0.95] select-none">
          SHISHIR 2026
        </h1>
        <h1 className="text-[clamp(2.5rem,6vw,4.0rem)] font-bold uppercase tracking-[-0.02em] leading-[1.1] bg-gradient-to-br from-white via-[#ffd960] to-[#7cf5ff] bg-clip-text text-transparent">
          Where Stars Converge
        </h1>
        <p className="text-[#a0aec0] text-lg tracking-[0.05em]">
          The Grand Cultural Extravaganza of the Northeast
        </p>
        <div className="mt-1 text-xs md:text-sm tracking-[0.25em] text-[#ffd960] uppercase font-medium">
          Saitsohpen, Sohra (Cherrapunji)
        </div>
        <div className="mt-2 text-[0.65rem] text-[#faebd7]/50 tracking-wider">
          All Rights reserved by National Institute of Technology, Meghalaya
        </div>
      </div>
    </section>
  );
};