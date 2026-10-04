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

/* Palette: Dusk Blue #3D5A80 · Powder Blue #98C1D9 · Burnt Peach #EE6C4D
   Light Cyan #E0FBFC · Jet Black #293241 */

/* Petal colours drawn from the brand blossom tones (plain strings, no per-frame hsla building) */
const PETAL_COLORS = ['#F9C9C4', '#F4A9A0', '#F6B7B0', '#FBDDD9', '#F4A9A0', '#EE6C4D'];

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

  return (
    <span
      ref={countRef}
      className="text-[#EE6C4D] inline-block"
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

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    // Cached tree rect: avoids a layout read for every petal that respawns
    let treeRect: DOMRect | null = null;
    const refreshTreeRect = () => {
      const treeEl = treeRef.current;
      const isMobile = window.innerWidth < 768;
      treeRect =
        !isMobile && treeEl && treeEl.offsetWidth > 0 && treeEl.offsetHeight > 0
          ? treeEl.getBoundingClientRect()
          : null;
    };

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      refreshTreeRect();
    };
    window.addEventListener('resize', handleResize);

    // ─── Ambient petals (fewer, cheaper) ──────────────────────────
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
      color: string;
    }

    const MAX_PETALS = 48;
    const BASE_PETALS = 18;
    const EXTRA_PETALS = MAX_PETALS - BASE_PETALS;
    const petals: Petal[] = [];

    // Unit petal path, built once and scaled per petal
    const PETAL = new Path2D();
    PETAL.moveTo(0, 0.6);
    PETAL.bezierCurveTo(-0.7, 0.2, -0.55, -0.45, -0.2, -0.6);
    PETAL.bezierCurveTo(-0.05, -0.45, 0.05, -0.45, 0.2, -0.6);
    PETAL.bezierCurveTo(0.55, -0.45, 0.7, 0.2, 0, 0.6);
    PETAL.closePath();

    const spawnPetal = (scatterInitial = false): Petal => {
      const isMobile = W < 768;

      if (!treeRect || treeRect.width === 0) refreshTreeRect();
      const rect = treeRect;

      let originX: number;
      let originY: number;

      if (rect) {
        // Sample from the floral canopy of the tree
        const normX = 0.24 + Math.random() * 0.60;
        const normY = normX < 0.5
          ? (0.32 + Math.random() * 0.38)
          : (0.18 + Math.random() * 0.32);

        originX = rect.left + rect.width * normX;
        originY = rect.top + rect.height * normY;
      } else {
        // Mobile fallback when the tree is hidden
        originX = W * (0.60 + Math.random() * 0.40);
        originY = H * (0.10 + Math.random() * 0.50);
      }

      const progress = scatterInitial ? Math.random() * 0.80 : 0;
      const x = originX - progress * (W * 0.48);
      const y = originY + progress * (H * 0.24);

      return {
        x,
        y,
        size: isMobile ? (7 + Math.random() * 10) : (8 + Math.random() * 12),
        vx: -(1.2 + Math.random() * 1.8),
        vy: 0.30 + Math.random() * 0.85,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.025,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.015 + Math.random() * 0.025,
        opacity: 0.6 + Math.random() * 0.35,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      };
    };

    refreshTreeRect();
    for (let i = 0; i < MAX_PETALS; i++) {
      petals.push(spawnPetal(i < BASE_PETALS));
    }

    let scrollBoost = 0;
    let lastScrollY = window.scrollY;
    let landingScrollProgress = 0;
    let previousActiveCount = BASE_PETALS;

    const onScrollVelocity = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      scrollBoost = Math.min(scrollBoost + delta * 0.015, 2.0);
    };
    window.addEventListener('scroll', onScrollVelocity, { passive: true });

    let isSectionVisible = true;

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      scrollBoost *= 0.92;

      const activeCount = Math.min(
        MAX_PETALS,
        Math.floor(BASE_PETALS + landingScrollProgress * EXTRA_PETALS)
      );

      const speedMultiplier = 1.0 + landingScrollProgress * 0.35 + scrollBoost * 0.15;

      if (activeCount > previousActiveCount) {
        for (let i = previousActiveCount; i < activeCount; i++) {
          petals[i] = spawnPetal(false);
        }
        previousActiveCount = activeCount;
      }

      const alphaScale = document.documentElement.classList.contains('dark') ? 0.9 : 1;

      for (let i = 0; i < activeCount; i++) {
        const p = petals[i];
        p.angle += p.angleSpeed * (1.0 + scrollBoost * 0.12);
        p.flip += p.flipSpeed * (1.0 + scrollBoost * 0.12);

        p.x += (p.vx - scrollBoost * 0.55) * speedMultiplier;
        p.y += (p.vy + scrollBoost * 0.15) * speedMultiplier;

        if (p.x < -40 || p.y > H + 40 || p.y < -30) {
          petals[i] = spawnPetal(false);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(Math.cos(p.flip) * p.size, p.size);
        ctx.globalAlpha = p.opacity * alphaScale;
        ctx.fillStyle = p.color;
        ctx.fill(PETAL);
        ctx.restore();
      }

      if (isSectionVisible) {
        animId = requestAnimationFrame(render);
      }
    };

    if (reduceMotion) {
      // No drifting petals for reduced-motion users
      canvas.style.display = 'none';
    } else {
      render();
    }

    // ─── GSAP ScrollTrigger sequence ──────────────────────────────
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

      if (treeDesc) {
        tl.to(treeDesc, {
          opacity: 0,
          y: 15,
          ease: 'power2.out',
          duration: 0.6,
        }, 0.05);
      }

      if (tree) {
        // Gentle ambient sway (skipped for reduced motion)
        if (!reduceMotion) {
          gsap.to(tree, {
            rotation: 1.2,
            x: 4,
            y: -3,
            duration: 4.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }

        tl.to(tree, {
          scale: 1.04,
          opacity: 0,
          y: 20,
          ease: 'power2.inOut',
          duration: 0.7,
        }, 1.3);
      }

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
        scrub: 0.15,
        animation: tl,
        onUpdate: (self) => {
          landingScrollProgress = self.progress;
        },
        onLeave: () => {
          isSectionVisible = false;
          if (animId) cancelAnimationFrame(animId);
        },
        onEnterBack: () => {
          if (!isSectionVisible && !reduceMotion) {
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
      {/* One shared blossom icon, reused by <use> so the marquee stays light */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <symbol id="sk-blossom" viewBox="0 0 24 24">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="12"
              cy="6.2"
              rx="3.6"
              ry="5"
              fill="currentColor"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
          <circle cx="12" cy="12" r="2" fill="#E0FBFC" />
          <circle cx="12" cy="12" r="0.9" fill="#EE6C4D" />
        </symbol>
      </svg>

      {/* Static soft glows (plain gradients, no blur filters) */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_12%_18%,rgba(152,193,217,0.5),transparent_55%),radial-gradient(ellipse_at_88%_92%,rgba(238,108,77,0.14),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_12%_18%,rgba(61,90,128,0.5),transparent_55%),radial-gradient(ellipse_at_88%_92%,rgba(238,108,77,0.1),transparent_50%)]"
        aria-hidden="true"
      />

      {/* ─── Drifting Petals Canvas ───────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
      />

      {/* ─── Wild Himalayan Cherry Tree ───────────────────────────── */}
      <div className="flex absolute right-0 bottom-0 h-[48vh] sm:h-[60vh] md:h-[80vh] w-full max-w-[85vw] sm:max-w-[75vw] md:max-w-[65vw] lg:max-w-[58vw] pointer-events-none justify-end items-end z-[2]">
        <Image
          src="/images/cherry_blossom.webp"
          alt="Welcome"
          width={1000}
          height={1000}
          quality={50}
          loading="eager"
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

      {/* ─── Header & Marquee ─────────────────────────────────────── */}
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
        <div className="relative flex mt-10 h-fit w-full justify-center">
          {/* SHISHIR */}
          <div
            className={`z-20 pt-5 text-[20vw] md:text-[12vw] leading-none text-[#293241] dark:text-[#E0FBFC] [text-shadow:0_4px_22px_rgba(61,90,128,0.35)] ${samanFont.className}`}
          >
            SHISHIR
          </div>
        </div>

        {/* Subtitle with fine rules either side */}
        <div className="mt-1 flex items-center justify-center gap-3 md:gap-4">
          <span className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-[#98C1D9]" />
          <span className="text-[0.7rem] md:text-sm tracking-[0.35em] md:tracking-[0.4em] text-[#3D5A80] dark:text-[#98C1D9] font-bold uppercase transition-colors duration-300">
            CULTURAL FEST OF NIT MEGHALAYA
          </span>
          <span className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-[#98C1D9]" />
        </div>

        {/* Event ribbon: a paper strip with a Dusk Blue edge and Peach line */}
        <div
          ref={marqueeRef}
          className="relative w-screen overflow-hidden mt-5 md:mt-6 py-2 md:py-3 pointer-events-none border-y-[3px] dark:border-[#98C1D9] bg-gradient-to-b from-white/70 via-[#F3FCFC]/70 to-[#DDF1F5]/70 dark:from-[#3b4d6b]/90 dark:via-[#33435e]/90 dark:to-[#2c3a52]/90 shadow-[0_14px_30px_-16px_rgba(61,90,128,0.55)] transition-colors duration-300"
        >

          <div className="animate-marquee flex items-center gap-6 md:gap-8 uppercase tracking-[0.16em] text-md md:text-lg text-[#293241] dark:text-[#E0FBFC]">
            {[0, 1].map((set) =>
              MARQUEE_EVENTS.map((evt, idx) => (
                <span
                  key={`m${set}-${idx}`}
                  className="flex items-center gap-6 md:gap-8 shrink-0"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#EE6C4D]" aria-hidden="true">
                    <use href="#sk-blossom" />
                  </svg>
                  <span>{evt}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .sakura-section .animate-marquee { animation: none !important; }
        }
      `}</style>
    </section>
  );
};