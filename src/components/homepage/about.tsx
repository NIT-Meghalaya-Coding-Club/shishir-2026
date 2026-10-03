'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Blossom from '@/components/Blossom';

/* ──────────────────────────────────────────────────────────────
   Palette (from the Shishir brand sheet)
   Dusk Blue  #3D5A80 · Powder Blue #98C1D9 · Burnt Peach #EE6C4D
   Light Cyan #E0FBFC · Jet Black   #293241
   ────────────────────────────────────────────────────────────── */

const PETAL_COLORS = ['#F9C9C4', '#F4A9A0', '#EE6C4D', '#FBDDD9', '#F6B7B0'];
const PETAL_COUNT = 16;

/** One wooden end-cap + cord, shared by both rods */
function RodCap({ position }: { position: 'top' | 'bottom' }) {
  const knob = (
    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-b from-[#3D5A80] via-[#293241] to-[#1b2230] border border-[#98C1D9]/60 shadow-[0_3px_8px_rgba(41,50,65,0.45)] flex items-center justify-center">
      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#EE6C4D]" />
    </div>
  );
  const band = (
    <div className="w-4 sm:w-5 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-[#EE6C4D] via-[#F6B7B0] to-[#EE6C4D]" />
  );

  if (position === 'top') {
    return (
      <div className="relative flex flex-col items-center -top-2">
        {band}
        <div className="mt-0.5">{knob}</div>
      </div>
    );
  }
  return (
    <div className="relative flex flex-col items-center -bottom-2">
      {knob}
      <div className="mt-0.5">{band}</div>
      {/* Silk tassel */}
      <div className="mt-0.5 flex flex-col items-center">
        <div className="w-px h-2 sm:h-3 bg-[#EE6C4D]" />
        <div className="w-1.5 sm:w-2 h-4 sm:h-6 rounded-b-full bg-gradient-to-b from-[#EE6C4D] via-[#F4A9A0] to-[#98C1D9] shadow-[0_2px_5px_rgba(41,50,65,0.3)]" />
      </div>
    </div>
  );
}

/** A rolled-paper roller: paper tube in the middle, wooden caps at the ends */
function Roller() {
  return (
    <>
      <RodCap position="top" />
      <div className="w-full flex-1 rounded-[3px] bg-gradient-to-r from-[#9db6c4] via-[#FFFDF8] via-[#F1F8F9] to-[#8aa6b8] shadow-[inset_0_0_0_1px_rgba(61,90,128,0.25),0_0_10px_rgba(41,50,65,0.25)]" />
      <RodCap position="bottom" />
    </>
  );
}

export default function AboutScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoColumnRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoFloatRef = useRef<HTMLDivElement>(null);
  const logoGlowRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const parchmentRef = useRef<HTMLDivElement>(null);
  const rightRodRef = useRef<HTMLDivElement>(null);
  const leftRodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const parchment = parchmentRef.current;
      const rightRod = rightRodRef.current;
      const scrollWrapper = scrollWrapperRef.current;
      const logo = logoRef.current;
      if (!parchment || !rightRod || !scrollWrapper || !logo) return;

      const reveals = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll('[data-reveal]')
      );
      const petals = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll('.rod-petal')
      );
      const branchPath = container.querySelector<SVGPathElement>('.branch-path');
      const blooms = gsap.utils.toArray<SVGElement>(
        container.querySelectorAll('.branch-bloom')
      );
      const seal = container.querySelector<HTMLElement>('.seal-stamp');

      /* Reduced motion: show the finished state, no pin, no movement */
      if (reduceMotion) {
        gsap.set(parchment, { clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set(rightRod, { x: parchment.offsetWidth });
        gsap.set(reveals, { opacity: 1, y: 0 });
        return;
      }

      /* Gentle idle float on the swan once it has arrived */
      if (logoFloatRef.current) {
        gsap.to(logoFloatRef.current, {
          y: -8,
          duration: 2.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      const computeDesktopOffsetX = () => {
        if (!logoColumnRef.current || !stageRef.current) return 0;
        const s = stageRef.current.getBoundingClientRect();
        const l = logoColumnRef.current.getBoundingClientRect();
        return s.left + s.width / 2 - (l.left + l.width / 2);
      };

      const computeMobileOffsetY = () => {
        if (!logoColumnRef.current || !stageRef.current) return 0;
        const s = stageRef.current.getBoundingClientRect();
        const l = logoColumnRef.current.getBoundingClientRect();
        return Math.max(0, (s.top + s.height / 2 - (l.top + l.height / 2)) * 0.35);
      };

      /* Prime the petals so they sit hidden on the rod before the reveal */
      gsap.set(petals, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=500%',
          pin: true,
          scrub: 0.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* 1 ─ Title settles in */
      if (titleWrapperRef.current) {
        tl.fromTo(
          titleWrapperRef.current,
          { y: 15, opacity: 0.85 },
          { y: 0, opacity: 1, ease: 'power1.out', duration: 0.7 },
          0
        );
      }

      /* 2 ─ Swan: rises into the centre, then glides left */
      tl.fromTo(
        logo,
        {
          x: () => (window.innerWidth >= 1024 ? computeDesktopOffsetX() : 0),
          y: () => (window.innerWidth < 1024 ? computeMobileOffsetY() + 40 : 60),
          scale: 0.7,
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

      if (logoGlowRef.current) {
        tl.fromTo(
          logoGlowRef.current,
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' },
          0.2
        );
      }

      tl.to(
        logo,
        { x: 0, y: 0, scale: 1, duration: 1.0, ease: 'power2.inOut' },
        1.1
      );

      /* 3 ─ Scroll glides in from the right */
      tl.fromTo(
        scrollWrapper,
        {
          x: () => (window.innerWidth >= 1024 ? Math.max(window.innerWidth * 0.5, 450) : 300),
          opacity: 0,
          scale: 0.95,
        },
        { x: 0, opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' },
        1.1
      );

      /* 4 ─ Unrolling: the roller travels, the paper is revealed behind it */
      tl.fromTo(
        rightRod,
        { x: 20 },
        { x: () => parchment.offsetWidth, ease: 'power2.inOut', duration: 2.2 },
        2.2
      );

      tl.fromTo(
        parchment,
        { clipPath: 'inset(0% calc(100% - 20px) 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 2.2 },
        2.2
      );

      /* 5 ─ Blossom petals shake loose from the roller as it travels.
             They are children of the roller, so they ride along with it
             and drift down and back across the freshly revealed paper. */
      petals.forEach((el, i) => {
        const start = 2.3 + (i / PETAL_COUNT) * 1.9;
        const dir = i % 2 === 0 ? 1 : -1;
        tl.fromTo(
          el,
          { x: 0, y: -10 + ((i * 23) % 60), rotate: 0, scale: 0.7 },
          {
            x: -(50 + ((i * 37) % 150)),
            y: 130 + ((i * 53) % 170),
            rotate: dir * (140 + ((i * 29) % 200)),
            scale: 1,
            duration: 1.5,
            ease: 'sine.out',
          },
          start
        );
        tl.fromTo(el, { opacity: 0 }, { opacity: 0.95, duration: 0.25, ease: 'none' }, start);
        tl.to(el, { opacity: 0, duration: 0.6, ease: 'none' }, start + 0.9);
      });

      /* 6 ─ Text arrives line by line, just behind the roller */
      tl.fromTo(
        reveals,
        { opacity: 0, y: 12, filter: 'blur(3px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.32,
          duration: 0.55,
          ease: 'power2.out',
        },
        2.7
      );

      /* 7 ─ A blossom branch draws itself in the corner */
      if (branchPath) {
        tl.fromTo(
          branchPath,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.0, ease: 'power1.inOut' },
          3.6
        );
      }
      if (blooms.length) {
        tl.fromTo(
          blooms,
          { scale: 0, opacity: 0, transformOrigin: '50% 50%' },
          {
            scale: 1,
            opacity: 1,
            transformOrigin: '50% 50%',
            stagger: 0.12,
            duration: 0.5,
            ease: 'back.out(2)',
          },
          3.9
        );
      }

      /* 8 ─ The seal is stamped last */
      if (seal) {
        tl.fromTo(
          seal,
          { scale: 2.2, opacity: 0, rotate: -18 },
          { scale: 1, opacity: 1, rotate: -6, duration: 0.45, ease: 'power3.in' },
          4.5
        );
        tl.fromTo(
          seal,
          { y: 0 },
          { y: 1.5, duration: 0.08, yoyo: true, repeat: 1, ease: 'none' },
          4.95
        );
      }

      /* 9 ─ Hold so the proclamation can be read */
      tl.to({}, { duration: 1.0 }, 5.1);
    }, container);

    return () => ctx.revert();
  }, []);

  /* A faint paper grain, inlined so there is no extra asset to load */
  const paperGrain =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.24  0 0 0 0 0.35  0 0 0 0 0.5  0 0 0 0.09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-[#E0FBFC] dark:bg-[#293241] select-none transition-colors duration-500 z-20 flex flex-col justify-between"
    >
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-between pt-10 sm:pt-14 md:pt-16 pb-4 sm:pb-6 md:pb-8">
        {/* ─── Title ─── */}
        <div ref={titleWrapperRef} className="text-center shrink-0 z-20 mb-1 sm:mb-2">
          <div className='flex text-center justify-center items-center'>
            <Blossom className="w-10 h-10 sm:w-10 sm:h-10 text-[#98C1D9] animate-spin [animation-duration:3s]" />
              <h2 className="shishir-title font-[900] text-3xl sm:text-4xl md:text-5xl lg:text-6xl ml-4 mr-4 tracking-tight text-[#EE6C4D] drop-shadow-[0_4px_25px_rgba(238,108,77,0.3)]">
                ABOUT SHISHIR
              </h2>
            <Blossom className="w-10 h-10 sm:w-10 sm:h-10 text-[#98C1D9] animate-spin [animation-duration:3s]" />
          </div>
          <p className="mt-1 text-[0.65rem] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.32em] text-[#3D5A80] dark:text-[#98C1D9] font-bold uppercase">
            ANNUAL CULTURAL FESTIVAL OF NIT MEGHALAYA
          </p>
        </div>

        {/* ─── Stage ─── */}
        <div
          ref={stageRef}
          className="relative flex-1 w-full flex items-center justify-center min-h-0 my-auto"
        >
          <div className="relative w-full flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-10">
            {/* Left: swan crest with a soft powder-blue / peach glow */}
            <div
              ref={logoColumnRef}
              className="w-full lg:w-5/12 flex items-center justify-center relative py-0.5 sm:py-1 lg:py-0 shrink-0"
            >
              <div
                ref={logoRef}
                className="relative flex items-center justify-center will-change-transform group cursor-pointer"
              >
                <div
                  ref={logoGlowRef}
                  className="absolute -inset-8 sm:-inset-12 rounded-full blur-2xl bg-[radial-gradient(circle,rgba(152,193,217,0.7)_0%,rgba(238,108,77,0.16)_55%,transparent_72%)] dark:bg-[radial-gradient(circle,rgba(152,193,217,0.3)_0%,rgba(238,108,77,0.14)_55%,transparent_72%)] pointer-events-none"
                />
                <div ref={logoFloatRef} className="relative">
                  <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-60 lg:h-60 transition-transform duration-500 ease-out group-hover:scale-105">
                    <Image
                      src="/assets/logo.png"
                      alt="SHISHIR Official Swan Crest - NIT Meghalaya"
                      width={280}
                      height={280}
                      priority
                      className="w-full h-full object-contain drop-shadow-[0_14px_22px_rgba(61,90,128,0.35)] select-none pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: washi-paper hanging scroll */}
            <div
              ref={scrollWrapperRef}
              className="w-full lg:w-7/12 flex items-center justify-center relative z-20 py-1 sm:py-3 lg:py-4 px-4 sm:px-5 will-change-transform"
            >
              <div className="relative w-full max-w-xl lg:max-w-2xl min-h-[300px] sm:min-h-[350px] md:min-h-[380px] flex items-center">
                {/* Left roller (fixed) */}
                <div
                  ref={leftRodRef}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 sm:w-4 md:w-5 h-[calc(100%+24px)] sm:h-[calc(100%+32px)] z-30 pointer-events-none flex flex-col items-center justify-between"
                >
                  <Roller />
                </div>

                {/* Paper */}
                <div
                  ref={parchmentRef}
                  style={{ clipPath: 'inset(0% calc(100% - 20px) 0% 0%)' }}
                  className="relative w-full h-full min-h-[300px] sm:min-h-[350px] md:min-h-[380px] rounded-[3px] overflow-hidden z-20 shadow-[0_24px_60px_-18px_rgba(61,90,128,0.5),0_0_0_1px_rgba(152,193,217,0.5)] border-y-[6px] border-[#3D5A80] dark:border-[#98C1D9]"
                >
                  {/* Frosted paper body, same glass feel as the navbar */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] via-[#F3FCFC] to-[#DDF1F5] dark:from-[#3b4d6b] dark:via-[#33435e] dark:to-[#2c3a52]" />
                  <div
                    className="absolute inset-0 opacity-70 dark:opacity-40 mix-blend-multiply pointer-events-none"
                    style={{ backgroundImage: paperGrain }}
                  />
                  {/* Mounting edge: thin peach line under the dusk-blue border */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#EE6C4D] z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EE6C4D] z-10" />

                  {/* Blossom branch that draws itself in the corner */}
                  <svg
                    viewBox="0 0 140 120"
                    className="hidden sm:block absolute top-1 right-1 sm:w-32 md:w-36 opacity-45 pointer-events-none z-0"
                    aria-hidden="true"
                  >
                    <path
                      className="branch-path"
                      pathLength={1}
                      style={{ strokeDasharray: 1, strokeDashoffset: 0 }}
                      d="M138 8 C112 16 94 38 66 52 S28 82 6 104 M94 38 C98 52 90 62 80 70 M66 52 C60 38 50 32 40 30"
                      fill="none"
                      stroke="#293241"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {[
                      [112, 17, '#F4A9A0'],
                      [94, 38, '#EE6C4D'],
                      [80, 70, '#F9C9C4'],
                      [66, 52, '#F4A9A0'],
                      [40, 30, '#F9C9C4'],
                      [28, 82, '#EE6C4D'],
                    ].map(([cx, cy, fill], i) => (
                      <g
                        key={i}
                        className="branch-bloom"
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                      >
                        <circle cx={cx as number} cy={cy as number} r="7" fill={fill as string} opacity="0.9" />
                        <circle cx={cx as number} cy={cy as number} r="2" fill="#FFF4E0" />
                      </g>
                    ))}
                  </svg>

                  {/* Writing area */}
                  <div className="relative h-full m-1.5 sm:m-3 p-3 sm:p-5 md:p-6 border border-[#3D5A80]/25 dark:border-[#98C1D9]/30 rounded-[2px] flex flex-col justify-between z-10">
                    {/* Header */}
                    <div
                      data-reveal
                      className="flex items-center justify-center gap-2 mb-1 sm:mb-1.5 pb-1.5 border-b border-[#3D5A80]/20 dark:border-[#98C1D9]/25"
                    >
                      <Blossom className="w-3 h-3 sm:w-4 sm:h-4 text-[#EE6C4D]" />
                      <span className="text-[0.62rem] sm:text-xs tracking-[0.2em] font-bold uppercase text-[#3D5A80] dark:text-[#98C1D9]">
                        Festival proclamation · NIT Meghalaya
                      </span>
                      <Blossom className="w-3 h-3 sm:w-4 sm:h-4 text-[#EE6C4D]" />
                    </div>

                    {/* Section 1 */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <div data-reveal className="flex items-center gap-2">
                        <Blossom className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F4A9A0] shrink-0" />
                        <h3 className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight text-[#3D5A80] dark:text-[#98C1D9]">
                          Where nature meets culture
                        </h3>
                      </div>
                      <p
                        data-reveal
                        className="font-serif text-[#293241] dark:text-[#E0FBFC] text-[0.7rem] sm:text-[0.85rem] md:text-[0.95rem] leading-snug sm:leading-relaxed"
                      >
                        Experience the enchanting allure of diversity at{' '}
                        <span className="font-bold text-[#EE6C4D]">SHISHIR</span>, the Annual
                        Cultural Fest of the National Institute of Technology, Meghalaya. Here,
                        amidst the harmonious blend of nature and culture, you&apos;ll be
                        transported to a realm where time stands still, allowing you to relive
                        moments of pure magic.
                      </p>
                    </div>

                    {/* Divider */}
                    <div
                      data-reveal
                      className="flex items-center justify-center gap-3 my-0.5 sm:my-1"
                    >
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#98C1D9] to-transparent" />
                      <Blossom className="w-3.5 h-3.5 text-[#EE6C4D]" />
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#98C1D9] to-transparent" />
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <div data-reveal className="flex items-center gap-2">
                        <Blossom className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F4A9A0] shrink-0" />
                        <h3 className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight text-[#3D5A80] dark:text-[#98C1D9]">
                          Annual extravaganza
                        </h3>
                      </div>
                      <p
                        data-reveal
                        className="font-serif text-[#293241] dark:text-[#E0FBFC] text-[0.7rem] sm:text-[0.85rem] md:text-[0.95rem] leading-snug sm:leading-relaxed pr-9 sm:pr-14"
                      >
                        <span className="font-bold text-[#EE6C4D]">NIT Meghalaya</span> extends a
                        warm welcome to all, as we prepare for Meghalaya&apos;s grandest cultural
                        extravaganza. Join us in celebrating the rich tapestry of cultures, where
                        every tradition converges on a single stage, amidst the crisp mountain
                        air, promising to etch unforgettable memories in your heart.
                      </p>
                    </div>

                    {/* Peach hanko-style seal */}
                    <div
                      className="seal-stamp absolute bottom-1.5 right-1.5 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-11 sm:h-11 rounded-md bg-[#EE6C4D] text-[#FFF4E0] flex items-center justify-center shadow-[0_2px_6px_rgba(238,108,77,0.45)] mix-blend-multiply dark:mix-blend-normal"
                      style={{ transform: 'rotate(-6deg)' }}
                      aria-hidden="true"
                    >
                      <div className="absolute inset-[3px] rounded-[4px] border border-[#FFF4E0]/70" />
                      <span className="text-[0.5rem] sm:text-xs font-extrabold leading-none tracking-tighter whitespace-nowrap">
                        SHISHIR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right roller (travels as the scroll opens) + falling petals */}
                <div
                  ref={rightRodRef}
                  style={{ left: 0 }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 sm:w-4 md:w-5 h-[calc(100%+24px)] sm:h-[calc(100%+32px)] z-30 pointer-events-none flex flex-col items-center justify-between will-change-transform"
                >
                  {/* Soft curl shadow cast onto the paper */}
                  <div className="absolute top-3 bottom-3 sm:top-4 sm:bottom-4 right-full w-4 sm:w-6 bg-gradient-to-l from-[#293241]/25 to-transparent pointer-events-none" />

                  {Array.from({ length: PETAL_COUNT }).map((_, i) => {
                    const size = 8 + (i % 4) * 3;
                    return (
                      <span
                        key={i}
                        className="rod-petal absolute left-1/2 pointer-events-none"
                        style={{
                          top: `${10 + ((i * 17) % 75)}%`,
                          width: size,
                          height: size * 1.25,
                          marginLeft: -size / 2,
                          background: PETAL_COLORS[i % PETAL_COLORS.length],
                          borderRadius: '100% 0 100% 0',
                          opacity: 0,
                        }}
                      />
                    );
                  })}

                  <Roller />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 shrink-0" />
      </div>

      {/* Soft fade into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#E0FBFC] dark:from-[#293241] to-transparent pointer-events-none z-[12]" />
    </section>
  );
}