'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoColumnRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const parchmentRef = useRef<HTMLDivElement>(null);
  const rightRodRef = useRef<HTMLDivElement>(null);
  const leftRodRef = useRef<HTMLDivElement>(null);

  // ─── Pinned Scroll Animation Choreography ──────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Helper function to calculate exact offset to center logo horizontally on desktop
      const computeDesktopOffsetX = () => {
        if (!logoColumnRef.current || !stageRef.current) return 0;
        const stageRect = stageRef.current.getBoundingClientRect();
        const logoColRect = logoColumnRef.current.getBoundingClientRect();
        const stageCenterX = stageRect.left + stageRect.width / 2;
        const logoColCenterX = logoColRect.left + logoColRect.width / 2;
        return stageCenterX - logoColCenterX;
      };

      const computeMobileOffsetY = () => {
        if (!logoColumnRef.current || !stageRef.current) return 0;
        const stageRect = stageRef.current.getBoundingClientRect();
        const logoColRect = logoColumnRef.current.getBoundingClientRect();
        const stageCenterY = stageRect.top + stageRect.height / 2;
        const logoColCenterY = logoColRect.top + logoColRect.height / 2;
        return Math.max(0, (stageCenterY - logoColCenterY) * 0.5);
      };

      // Master Pinned Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Background Video subtle parallax drift
      if (videoRef.current) {
        tl.to(
          videoRef.current,
          { y: 30, scale: 1.0, ease: 'none', duration: 4.0 },
          0
        );
      }

      // 2. Title subtle arrival polish
      if (titleWrapperRef.current) {
        tl.fromTo(
          titleWrapperRef.current,
          { y: 15, opacity: 0.85 },
          { y: 0, opacity: 1, ease: 'power1.out', duration: 0.7 },
          0
        );
      }

      // 3. Swan Logo Choreography:
      // Step A: Logo comes into the center of the screen (clean, zero glow)
      // Step B: Holds in center, then glides to the left side as the scroll enters from the right
      if (logoRef.current) {
        // Step A: Logo enters and rises into the dead center of the screen
        tl.fromTo(
          logoRef.current,
          {
            x: () => (window.innerWidth >= 1024 ? computeDesktopOffsetX() : 0),
            y: () => (window.innerWidth < 1024 ? computeMobileOffsetY() + 50 : 60),
            scale: 0.65,
            opacity: 0,
          },
          {
            x: () => (window.innerWidth >= 1024 ? computeDesktopOffsetX() : 0),
            y: 0,
            scale: 1.15,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
          },
          0
        );

        // Step B: Logo glides smoothly from center to the left column (x: 0)
        tl.to(
          logoRef.current,
          {
            x: 0,
            y: 0,
            scale: 1.0,
            duration: 1.05,
            ease: 'power2.inOut',
          },
          1.25
        );
      }

      // 4. Scroll Choreography:
      // Step A: Starts off-screen to the right side of the screen
      // Step B: Glides in from the right side of the screen into position
      // Step C: Scrolls open from left to right with the golden text inside
      if (scrollWrapperRef.current && rightRodRef.current && parchmentRef.current) {
        // Step B: Bring the scroll in purely from the right side of the screen (NOT from beneath)
        tl.fromTo(
          scrollWrapperRef.current,
          {
            x: () => (window.innerWidth >= 1024 ? Math.max(window.innerWidth * 0.5, 450) : 320),
            y: 0,
            opacity: 0,
            scale: 0.95,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1.0,
            duration: 1.0,
            ease: 'power2.out',
          },
          1.25
        );

        // Step C: Scroll scrolls open with the text
        tl.fromTo(
          rightRodRef.current,
          { left: '20px' },
          {
            left: '100%',
            ease: 'power2.inOut',
            duration: 1.25,
          },
          2.25
        );

        tl.fromTo(
          parchmentRef.current,
          { clipPath: 'inset(0% calc(100% - 20px) 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.inOut',
            duration: 1.25,
          },
          2.25
        );
      }

      // Phase 5: Pinned hold for comfortable reading of the unrolled royal decree
      tl.to({}, { duration: 0.6 }, 3.5);

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#000717] via-[#000c24] to-[#001233] select-none transition-colors duration-500 z-20 flex flex-col justify-between"
    >
      {/* ─── Parallax Background Video (Clean, High Contrast, No White Blur) ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 md:opacity-50">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full scale-105"
        >
          <source src="/videos/about.mp4" type="video/mp4" />
        </video>
        {/* Cinematic Vignette Overlay (Dark only) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000717] via-transparent to-[#000717]/80" />
      </div>

      {/* ─── Main Content Container (Pinned In-Place, Crisp on z-20) ─── */}
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-between pt-12 sm:pt-14 md:pt-16 pb-6 md:pb-8">
        
        {/* ─── 1. Title on Top: ABOUT SHISHIR ─── */}
        <div ref={titleWrapperRef} className="text-center shrink-0 z-20 mb-1 sm:mb-2">
          <h2 className="font-[900] text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white drop-shadow-[0_4px_25px_rgba(212,162,0,0.35)] transition-colors duration-300">
            ABOUT{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4a200] via-[#ffe066] to-[#ffd960]">
              SHISHIR
            </span>
          </h2>
          <p className="mt-1 text-[0.65rem] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.32em] text-[#ffd960]/80 font-semibold uppercase">
            ANNUAL CULTURAL FESTIVAL OF NIT MEGHALAYA
          </p>
        </div>

        {/* ─── 2. Interactive Stage: Swan Logo on Left, Red-Golden Scroll on Right ─── */}
        <div
          ref={stageRef}
          className="relative flex-1 w-full flex items-center justify-center min-h-0 my-auto"
        >
          <div className="relative w-full flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-10">
            
            {/* Left Column: Swan Crest / Logo (Clean, ZERO glowy effect behind it) */}
            <div
              ref={logoColumnRef}
              className="w-full lg:w-5/12 flex items-center justify-center relative py-1 lg:py-0"
            >
              <div
                ref={logoRef}
                className="relative flex items-center justify-center will-change-transform group cursor-pointer"
              >
                <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-64 lg:h-64 transition-transform duration-500 ease-out group-hover:scale-105">
                  <Image
                    src="/assets/logo.png"
                    alt="SHISHIR Official Swan Crest - NIT Meghalaya"
                    width={280}
                    height={280}
                    priority
                    className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.75)] select-none pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Royal Red-Golden Scroll (Comes from right side of screen, scrolls open with text) */}
            <div
              ref={scrollWrapperRef}
              className="w-full lg:w-7/12 flex items-center justify-center relative z-20 py-2 sm:py-4 will-change-transform"
            >
              {/* Outer Scroll Stage with Finial Padding */}
              <div className="relative w-full max-w-2xl min-h-[330px] sm:min-h-[360px] md:min-h-[370px] flex items-center">
                
                {/* ─── Left Golden Roller Rod (Stationary Spindle Anchor) ─── */}
                <div
                  ref={leftRodRef}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 sm:w-5 h-[calc(100%+32px)] z-30 pointer-events-none flex flex-col items-center justify-between"
                >
                  {/* Top Finial Knob */}
                  <div className="relative flex flex-col items-center -top-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-rose-700 via-red-500 to-pink-300 shadow-[0_0_8px_rgba(244,63,94,0.9)] mb-0.5" />
                    <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 via-yellow-200 to-amber-700 shadow-sm" />
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-[#ffd700] via-[#f59e0b] to-[#78350f] shadow-[0_0_12px_rgba(245,158,11,0.6)] border border-yellow-200/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-rose-600 shadow-inner" />
                    </div>
                  </div>

                  {/* Main Golden Rod Shaft */}
                  <div className="w-full flex-1 rounded-sm bg-gradient-to-r from-[#85570d] via-[#ffd700] via-[#fff4b8] via-[#e5b338] to-[#5a3804] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_0_10px_rgba(0,0,0,0.5)] border-y border-amber-300/60" />

                  {/* Bottom Finial Knob & Silk Tassel */}
                  <div className="relative flex flex-col items-center -bottom-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-[#ffd700] via-[#f59e0b] to-[#78350f] shadow-[0_0_12px_rgba(245,158,11,0.6)] border border-yellow-200/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-rose-600 shadow-inner" />
                    </div>
                    <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 via-yellow-200 to-amber-700 shadow-sm mt-0.5" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-rose-700 via-red-500 to-pink-300 shadow-[0_0_8px_rgba(244,63,94,0.9)] mt-0.5" />
                    <div className="mt-0.5 flex flex-col items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
                      <div className="w-2 h-5 sm:h-7 rounded-b-md bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-600 shadow-[0_2px_6px_rgba(0,0,0,0.6)] opacity-95" />
                    </div>
                  </div>
                </div>

                {/* ─── The Red-Golden Silk Parchment Fabric (Unrolls with Scroll) ─── */}
                <div
                  ref={parchmentRef}
                  style={{ clipPath: 'inset(0% calc(100% - 20px) 0% 0%)' }}
                  className="relative w-full h-full min-h-[330px] sm:min-h-[360px] md:min-h-[370px] rounded-sm overflow-hidden z-20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(180,83,9,0.25)] border-y-4 border-amber-400/90"
                >
                  {/* Imperial Ruby Velvet/Silk Background */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7f0918] via-[#52040d] to-[#2a0106]" />

                  {/* Top & Bottom Ornate Gold Ribbon Trims */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-500 shadow-sm z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-500 shadow-sm z-10" />

                  {/* Inner Gold Filigree Inset Frame with Corner Lotus Marks */}
                  <div className="relative h-full m-2 sm:m-3 p-3.5 sm:p-4 md:p-5 border border-amber-400/40 rounded-sm flex flex-col justify-between z-10">
                    
                    {/* Corner Ornaments */}
                    <span className="absolute top-1 left-1.5 text-amber-300 text-xs select-none">✦</span>
                    <span className="absolute top-1 right-1.5 text-amber-300 text-xs select-none">✦</span>
                    <span className="absolute bottom-1 left-1.5 text-amber-300 text-xs select-none">✦</span>
                    <span className="absolute bottom-1 right-1.5 text-amber-300 text-xs select-none">✦</span>

                    {/* Scroll Header Banner */}
                    <div className="flex items-center justify-center gap-2 mb-1.5 pb-1.5 border-b border-amber-400/30">
                      <span className="text-amber-400 text-xs">❖</span>
                      <span className="text-[0.62rem] sm:text-xs tracking-[0.25em] font-serif font-bold uppercase text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
                        FESTIVAL PROCLAMATION · NIT MEGHALAYA
                      </span>
                      <span className="text-amber-400 text-xs">❖</span>
                    </div>

                    {/* Story Section 1: Where Nature Meets Culture */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <h3 className="text-[0.72rem] sm:text-xs md:text-sm font-bold tracking-[0.18em] uppercase text-[#fff0a8] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                          WHERE NATURE MEETS CULTURE
                        </h3>
                      </div>
                      <p className="text-[#ffe8b3] text-[0.75rem] sm:text-[0.85rem] md:text-[0.92rem] leading-relaxed font-normal tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                        Experience the enchanting allure of diversity at{' '}
                        <span className="font-bold text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                          SHISHIR
                        </span>
                        , the Annual Cultural Fest of the National Institute of Technology, Meghalaya.
                        Here, amidst the harmonious blend of nature and culture, you&apos;ll be transported
                        to a realm where time stands still, allowing you to relive moments of pure magic.
                      </p>
                    </div>

                    {/* Ornamental Gold Filigree Divider */}
                    <div className="flex items-center justify-center gap-3 my-1 opacity-75">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                      <span className="text-amber-300 text-xs tracking-widest select-none">✦ ❖ ✦</span>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                    </div>

                    {/* Story Section 2: Annual Extravaganza */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <h3 className="text-[0.72rem] sm:text-xs md:text-sm font-bold tracking-[0.18em] uppercase text-[#fff0a8] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                          ANNUAL EXTRAVAGANZA
                        </h3>
                      </div>
                      <p className="text-[#ffe8b3] text-[0.75rem] sm:text-[0.85rem] md:text-[0.92rem] leading-relaxed font-normal tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                        <span className="font-bold text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                          NIT Meghalaya
                        </span>{' '}
                        extends a warm welcome to all, as we prepare for Meghalaya&apos;s grandest cultural
                        extravaganza. Join us in celebrating the rich tapestry of cultures, where every
                        tradition converges on a single stage, amidst the crisp mountain air, promising to
                        etch unforgettable memories in your heart.
                      </p>
                    </div>

                  </div>
                </div>

                {/* ─── Right Golden Roller Rod (Active Moving Spindle) ─── */}
                <div
                  ref={rightRodRef}
                  style={{ left: '20px' }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 sm:w-5 h-[calc(100%+32px)] z-30 pointer-events-none flex flex-col items-center justify-between drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                >
                  {/* Roller Curl Shadow (Cast behind the moving rod onto unrolled parchment) */}
                  <div className="absolute top-4 bottom-4 right-full w-4 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />

                  {/* Top Finial Knob */}
                  <div className="relative flex flex-col items-center -top-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-rose-700 via-red-500 to-pink-300 shadow-[0_0_8px_rgba(244,63,94,0.9)] mb-0.5" />
                    <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 via-yellow-200 to-amber-700 shadow-sm" />
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-[#ffd700] via-[#f59e0b] to-[#78350f] shadow-[0_0_12px_rgba(245,158,11,0.6)] border border-yellow-200/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-rose-600 shadow-inner" />
                    </div>
                  </div>

                  {/* Main Golden Rod Shaft */}
                  <div className="w-full flex-1 rounded-sm bg-gradient-to-r from-[#85570d] via-[#ffd700] via-[#fff4b8] via-[#e5b338] to-[#5a3804] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),-4px_0_8px_rgba(0,0,0,0.6)] border-y border-amber-300/60" />

                  {/* Bottom Finial Knob & Silk Tassel */}
                  <div className="relative flex flex-col items-center -bottom-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-[#ffd700] via-[#f59e0b] to-[#78350f] shadow-[0_0_12px_rgba(245,158,11,0.6)] border border-yellow-200/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-rose-600 shadow-inner" />
                    </div>
                    <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 via-yellow-200 to-amber-700 shadow-sm mt-0.5" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-rose-700 via-red-500 to-pink-300 shadow-[0_0_8px_rgba(244,63,94,0.9)] mt-0.5" />
                    <div className="mt-0.5 flex flex-col items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
                      <div className="w-2 h-5 sm:h-7 rounded-b-md bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-600 shadow-[0_2px_6px_rgba(0,0,0,0.6)] opacity-95" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ─── Bottom Soft Space ─── */}
        <div className="h-1 shrink-0" />
      </div>

      {/* ─── Bottom Soft Gradient Transition into CountdownTimer ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#000717] to-transparent pointer-events-none z-[12]" />
    </section>
  );
}
