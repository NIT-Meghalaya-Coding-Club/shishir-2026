'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from "next/image";

import localFont from 'next/font/local';

const samanFont = localFont({
  src: '../../app/fonts/saman_font.ttf',
  display: 'swap',         
});

const MARQUEE_EVENTS = [
  'PRANATYA',
  'BATTLE OF THE BANDS',
  'VOICE OF SHISHIR',
  'FASHION SHOW',
  'STREET THEATRE',
  'EDM NIGHT',
  'CELEBRITY NIGHT',
  'CHOREO NIGHT',
  'COSPLAY ARENA',
];

export const NumberCounter = ({
  end,
  duration = 1000,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(2010);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 2010;
          const step = (end-start) / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start > end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  // Calculate the maximum width needed
  const maxDigits = end.toString().length+1; // +1 for the '+' sign

  return (
    <span
      ref={countRef}
      className=" text-amber-400 inline-block"
      
    >
      {count}<span className="font-bold"></span>
    </span>
  );
};

export const SakuraLanding: React.FC = () => {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const topHeaderRef = useRef<HTMLDivElement>(null);
  const marqueeRef   = useRef<HTMLDivElement>(null);
  const treeDescRef  = useRef<HTMLDivElement>(null);
  const treeRef      = useRef<HTMLImageElement>(null);
  const [navOffset, setNavOffset] = useState<number>(0);

  useEffect(() => {
    const updateNavOffset = () => {
      const nav = document.getElementById('main-navbar') || document.querySelector('nav');
      if (nav) {
        const computedTop = parseFloat(window.getComputedStyle(nav).top) || 8;
        const totalHeight = (nav as HTMLElement).offsetHeight + computedTop;
        setNavOffset(totalHeight);
      }
    };

    updateNavOffset();
    const timer = setTimeout(updateNavOffset, 550);
    window.addEventListener('resize', updateNavOffset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateNavOffset);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // ─── Ambient Petals Particle System with Increased Density & Velocity ──
    interface Petal {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      angle: number;
      angleSpeed: number;
      flip: number;
      flipSpeed: number;
      opacity: number;
      hue: number;
    }

    const MAX_PETALS = 65; // Balanced, elegant blossom density
    const petals: Petal[] = [];

    const getTreeBlossomRect = () => {
      const isMobile = window.innerWidth < 768;
      const treeEl = treeRef.current;
      if (!isMobile && treeEl && treeEl.offsetWidth > 0 && treeEl.offsetHeight > 0) {
        return treeEl.getBoundingClientRect();
      }
      return null;
    };

    const spawnPetal = (scatterInitial = false): Petal => {
      const isMobile = W < 768;
      const rect = getTreeBlossomRect();

      let originX: number;
      let originY: number;

      if (rect) {
        // Samples strictly from the floral canopy of the tree
        const normX = 0.24 + Math.random() * 0.60;
        // The branch arches: higher on right (0.20-0.45), lower on left (0.35-0.70)
        const normY = normX < 0.5
          ? (0.32 + Math.random() * 0.38)
          : (0.18 + Math.random() * 0.32);

        originX = rect.left + rect.width * normX;
        originY = rect.top + rect.height * normY;
      } else {
        // Mobile fallback when tree is hidden: gentle stream across page
        originX = W * (0.60 + Math.random() * 0.40);
        originY = H * (0.10 + Math.random() * 0.50);
      }

      // Initial page load resting state: gentle spread along leftward drift trail
      const progress = scatterInitial ? Math.random() * 0.80 : 0;
      const x = originX - progress * (W * 0.48);
      const y = originY + progress * (H * 0.24);

      return {
        x,
        y,
        size: isMobile ? (7 + Math.random() * 10) : (8 + Math.random() * 12),
        vx: -(1.2 + Math.random() * 1.8), // Calm, natural leftward drift
        vy: 0.30 + Math.random() * 0.85,  // Gentle downward drift
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.025,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.015 + Math.random() * 0.025,
        opacity: 0.6 + Math.random() * 0.35,
        hue: 340 + Math.random() * 20, // Soft pink and creamy blossom hues
      };
    };

    // Initialize: first 22 are visible at rest; all others start queued at the tree
    for (let i = 0; i < MAX_PETALS; i++) {
      petals.push(spawnPetal(i < 22));
    }

    let scrollBoost = 0;
    let lastScrollY = window.scrollY;
    let landingScrollProgress = 0;
    let previousActiveCount = 22;

    const onScrollVelocity = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      // Gentle wind breeze boost - strictly capped to avoid unnatural high-speed blur
      scrollBoost = Math.min(scrollBoost + delta * 0.015, 2.0);
    };
    window.addEventListener('scroll', onScrollVelocity, { passive: true });

    // Draw single stylized petal with characteristic notch
    const drawPetalShape = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, size * 0.6);
      c.bezierCurveTo(-size * 0.7, size * 0.2, -size * 0.55, -size * 0.45, -size * 0.2, -size * 0.6);
      c.bezierCurveTo(-size * 0.05, -size * 0.45, size * 0.05, -size * 0.45, size * 0.2, -size * 0.6);
      c.bezierCurveTo(size * 0.55, -size * 0.45, size * 0.7, size * 0.2, 0, size * 0.6);
      c.closePath();
    };

    let isSectionVisible = true;

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      scrollBoost *= 0.92; // Decay wind gust gradually

      // At scroll 0: ~22 peaceful leaves drifting gently
      // On scroll: gently scales up to ~55 leaves
      const activeCount = Math.min(
        MAX_PETALS,
        Math.floor(22 + landingScrollProgress * 36)
      );

      // Controlled, natural speed multiplier (max ~1.5x during active scroll)
      const speedMultiplier = 1.0 + landingScrollProgress * 0.35 + scrollBoost * 0.15;

      // When scroll increases, newly activated particles are spawned fresh on the tree branches
      if (activeCount > previousActiveCount) {
        for (let i = previousActiveCount; i < activeCount; i++) {
          petals[i] = spawnPetal(false); // Emerge fresh from tree flowers!
        }
        previousActiveCount = activeCount;
      }

      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

      for (let i = 0; i < activeCount; i++) {
        const p = petals[i];
        p.angle += p.angleSpeed * (1.0 + scrollBoost * 0.12);
        p.flip += p.flipSpeed * (1.0 + scrollBoost * 0.12);

        // Controlled, graceful breeze velocity
        const effectiveVx = (p.vx - scrollBoost * 0.55) * speedMultiplier;
        const effectiveVy = (p.vy + scrollBoost * 0.15) * speedMultiplier;

        p.x += effectiveVx;
        p.y += effectiveVy;

        // Wrap around when leaving boundary: ALWAYS respawn from the tree branches!
        if (p.x < -40 || p.y > H + 40 || p.y < -30) {
          petals[i] = spawnPetal(false);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(Math.cos(p.flip), 1);

        ctx.fillStyle = isDark
          ? `hsla(${p.hue}, 85%, 82%, ${p.opacity * 0.9})`
          : `hsla(${p.hue}, 88%, 68%, ${p.opacity})`;

        drawPetalShape(ctx, p.size);
        ctx.fill();
        ctx.restore();
      }

      if (isSectionVisible) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    // ─── GSAP ScrollTrigger Sequence for Smooth Section Dissolve ──
    const section = sectionRef.current;
    const topHeader = topHeaderRef.current;
    const marquee = marqueeRef.current;
    const treeDesc = treeDescRef.current;
    const tree = treeRef.current;

    if (!section || !topHeader) {
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', onScrollVelocity);
        cancelAnimationFrame(animId);
      };
    }

    const ctxTimeline = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Header & marquee glide away softly as scroll begins (0.0 -> 0.7)
      tl.to(topHeader, {
        opacity: 0,
        y: -35,
        ease: 'power2.out',
        duration: 0.7,
      }, 0);

      if (marquee) {
        tl.to(marquee, {
          opacity: 0,
          scale: 0.98,
          ease: 'power2.out',
          duration: 0.65,
        }, 0);
      }

      // 2. Tree description fades out softly (0.05 -> 0.65)
      if (treeDesc) {
        tl.to(treeDesc, {
          opacity: 0,
          y: 15,
          ease: 'power2.out',
          duration: 0.6,
        }, 0.05);
      }

      // 3. Tree stays visible throughout petal flow, then dissolves gracefully near section end (1.3 -> 2.0)
      if (tree) {
        // Gentle ambient wind-sway breathing loop
        gsap.to(tree, {
          rotation: 1.2,
          x: 4,
          y: -3,
          duration: 4.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });

        tl.to(tree, {
          scale: 1.04,
          opacity: 0,
          y: 20,
          ease: 'power2.inOut',
          duration: 0.7,
        }, 1.3);
      }

      // 4. Petal canvas dissolves in unison with the tree (1.25 -> 1.95)
      tl.to(canvas, {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
      }, 1.25);

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.15, // Immediately responsive to scroll velocity
        animation: tl,
        onUpdate: (self) => {
          landingScrollProgress = self.progress;
        },
        onLeave: () => {
          isSectionVisible = false;
          if (animId) cancelAnimationFrame(animId);
        },
        onEnterBack: () => {
          if (!isSectionVisible) {
            isSectionVisible = true;
            animId = requestAnimationFrame(render);
          }
        },
      });
    }, sectionRef);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScrollVelocity);
      cancelAnimationFrame(animId);
      ctxTimeline.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="sakura-section relative w-screen h-screen overflow-hidden bg-[#E0FBFC] dark:bg-[#293241] select-none z-10 flex flex-col justify-between transition-colors duration-300"
    >
      {/* ─── Drifting Petals Canvas ────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
      />

      {/* ─── Wild Himalayan Cherry Tree (Responsive on Mobile & Desktop, Anchored Bottom-Right) ─── */}
      <div className="flex absolute right-0 bottom-0 h-[48vh] sm:h-[60vh] md:h-[80vh] w-full max-w-[85vw] sm:max-w-[75vw] md:max-w-[65vw] lg:max-w-[58vw] pointer-events-none justify-end items-end z-[2]">
        <Image
          src="/images/cherry_blossom.webp"
          alt="Welcome"
          width={1000}
          height={1000}
          quality={50}
          sizes="(max-width: 640px) 85vw, (max-width: 768px) 75vw, (max-width: 1024px) 65vw, 58vw"
          className="
            h-auto
            max-h-[46vh] sm:max-h-[58vh] md:max-h-[74vh]
            w-auto object-contain object-right-bottom
            select-none pointer-events-none
            opacity-90 md:opacity-95
            [mask-image:linear-gradient(to_left,black_70%,transparent_100%)]
            will-change-transform origin-bottom-right
          "
        />
      </div>

      {/* ─── Header & Marquee (Centered in Middle on Mobile, Top-Anchored on Desktop) ─── */}
      <div
        ref={topHeaderRef}
        style={{
          paddingTop: navOffset
            ? `${navOffset + 20}px`
            : 'calc(var(--navbar-total-height, 5rem) + 1.25rem)',
        }}
        className="flex-1 md:flex-initial flex flex-col items-center justify-center md:justify-start pt-24 md:pt-28 px-4 md:px-12 text-center z-[4] pointer-events-none"
      >
        {/* Small branch in the corner */}
          <Image
            src="/images/tree_branch.webp"
            alt="Welcome"
            width={1500}
            height={900}
            priority
            className="
              absolute
              w-[clamp(300px,40vw,500px)]
              left-0
              top-0
              h-auto
              drop-shadow-[0_4px_30px_rgba(238,108,77,0.25)]
            "
          />
      <div className="relative flex h-fit w-full justify-center">
          {/* SHISHIR */}
          <div
            className={`z-20 pt-5 text-[20vw] md:text-[12vw] text-[#293241] drop-shadow-[0_0_6px_rgba(61,90,128,0.8)] ${samanFont.className}`}
          >
            SHISHIR
          </div>
        </div>
        <div className="mt-0 md:mt-0 text-[0.7rem] md:text-sm tracking-[0.35em] md:tracking-[0.4em] text-[#3D5A80] dark:text-[#98C1D9] font-bold uppercase transition-colors duration-300">
          CULTURAL FEST OF NIT MEGHALAYA
        </div>

        {/* Moving Event Names Marquee Banner */}
        <div
          ref={marqueeRef}
          className="w-screen overflow-hidden border-y border-[#98C1D9]/30 dark:border-[#98C1D9]/20 bg-[#E0FBFC]/80 dark:bg-[#293241]/80 py-2 md:py-3 mt-5 md:mt-4 pointer-events-none transition-colors duration-300 backdrop-blur-sm"
        >
          <div className="animate-marquee flex items-center gap-6 md:gap-8 font-black uppercase tracking-[0.16em] text-lg md:text-2xl text-[#293241] dark:text-[#E0FBFC]">
            {MARQUEE_EVENTS.map((evt, idx) => (
              <span key={`m1-${idx}`} className="flex items-center gap-6 md:gap-8 shrink-0">
                <span className="text-[#EE6C4D] text-sm md:text-lg font-bold">•</span>
                <span>{evt}</span>
              </span>
            ))}
            {/* Duplicate set for seamless infinite loop */}
            {MARQUEE_EVENTS.map((evt, idx) => (
              <span key={`m2-${idx}`} className="flex items-center gap-6 md:gap-8 shrink-0">
                <span className="text-[#EE6C4D] text-sm md:text-lg font-bold">•</span>
                <span className='text-[#293241]'>{evt}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom Area: Botanical Tree Description ─── */}
      {/* <div className="flex pb-4 sm:pb-6 lg:pb-8 px-4 sm:px-8 lg:px-14 items-end justify-end z-[4] pointer-events-none relative flex-1 min-h-0">
        <div
          ref={treeDescRef}
          className="flex flex-col items-end text-right gap-0.5 sm:gap-1 max-w-[200px] sm:max-w-xs pointer-events-none z-[4] mb-2 sm:mb-3 ml-auto"
        >
          <div className="text-[0.62rem] sm:text-[0.72rem] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#EE6C4D] dark:text-[#98C1D9] font-semibold transition-colors duration-300">
            Prunus cerasoides · Wild Himalayan Cherry
          </div>
          <p className="text-[0.58rem] sm:text-[0.68rem] tracking-[0.05em] text-[#3D5A80] dark:text-[#E0FBFC]/70 font-light transition-colors duration-300">
            Local to Meghalaya · Blooms in November
          </p>
        </div>
      </div> */}
    </section>
  );
};


