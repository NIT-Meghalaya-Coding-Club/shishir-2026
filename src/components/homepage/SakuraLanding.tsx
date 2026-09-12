'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

        const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
        const grad = ctx.createLinearGradient(0, -p.size * 0.6, 0, p.size * 0.6);
        if (isDark) {
          grad.addColorStop(0, `hsla(${p.hue}, 90%, 94%, ${p.opacity})`);
          grad.addColorStop(0.5, `hsla(${p.hue}, 85%, 80%, ${p.opacity * 0.95})`);
          grad.addColorStop(1, `hsla(${p.hue}, 80%, 68%, ${p.opacity * 0.8})`);
        } else {
          // Vivid, elegant petal shades for crisp white background
          grad.addColorStop(0, `hsla(${p.hue}, 92%, 84%, ${Math.min(1, p.opacity * 1.15)})`);
          grad.addColorStop(0.5, `hsla(${p.hue}, 88%, 70%, ${Math.min(1, p.opacity * 1.1)})`);
          grad.addColorStop(1, `hsla(${p.hue}, 84%, 56%, ${p.opacity})`);
        }

        ctx.fillStyle = grad;
        drawPetalShape(ctx, p.size);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
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
        tl.to(tree, {
          scale: 1.04,
          opacity: 0,
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
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => {
          landingScrollProgress = self.progress;
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
      className="sakura-section relative w-screen h-screen overflow-hidden bg-white dark:bg-black select-none z-10 flex flex-col justify-between transition-colors duration-300"
    >
      {/* ─── Drifting Petals Canvas ────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
      />

      {/* ─── Wild Himalayan Cherry Tree (Anchored on Right Side, Desktop Only, Clean Below Banner) ─── */}
      <div className="hidden md:flex absolute right-0 bottom-0 h-[80vh] w-full max-w-[65vw] lg:max-w-[58vw] pointer-events-none justify-end items-end z-[2]">
        <img
          ref={treeRef}
          src="/images/himalayan_cherry_transparent.png"
          alt="Wild Himalayan Cherry Tree (Prunus cerasoides) - Meghalaya"
          className="h-auto max-h-[74vh] w-auto object-contain object-right-bottom select-none pointer-events-none opacity-95 [mask-image:linear-gradient(to_left,black_75%,transparent_100%)]"
          draggable={false}
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
        <h1 className="text-[clamp(4.2rem,15vw,10.5rem)] font-[900] uppercase tracking-[-0.03em] leading-[0.88] text-neutral-900 dark:text-white drop-shadow-[0_4px_30px_rgba(244,63,94,0.18)] dark:drop-shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-colors duration-300">
          SHISHIR
        </h1>
        <div className="mt-2.5 md:mt-3 text-[0.7rem] md:text-sm tracking-[0.35em] md:tracking-[0.4em] text-neutral-600 dark:text-neutral-300 font-semibold uppercase transition-colors duration-300">
          CULTURAL FEST OF NIT MEGHALAYA
        </div>

        {/* Moving Event Names Marquee Banner */}
        <div
          ref={marqueeRef}
          className="w-screen overflow-hidden border-y border-neutral-200 dark:border-white/20 bg-neutral-100/80 dark:bg-white/[0.03] py-2 md:py-3 mt-5 md:mt-4 pointer-events-none transition-colors duration-300"
        >
          <div className="animate-marquee flex items-center gap-6 md:gap-8 font-black uppercase tracking-[0.16em] text-lg md:text-2xl text-neutral-800 dark:text-white">
            {MARQUEE_EVENTS.map((evt, idx) => (
              <span key={`m1-${idx}`} className="flex items-center gap-6 md:gap-8 shrink-0">
                <span className="text-pink-500 dark:text-white text-sm md:text-lg font-bold">•</span>
                <span>{evt}</span>
              </span>
            ))}
            {/* Duplicate set for seamless infinite loop */}
            {MARQUEE_EVENTS.map((evt, idx) => (
              <span key={`m2-${idx}`} className="flex items-center gap-6 md:gap-8 shrink-0">
                <span className="text-pink-500 dark:text-white text-sm md:text-lg font-bold">•</span>
                <span>{evt}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom Area: Botanical Tree Description (Right Side next to Cherry Tree) ─── */}
      <div className="hidden md:flex pb-6 lg:pb-8 px-8 lg:px-14 items-end justify-end z-[4] pointer-events-none relative flex-1 min-h-0">
        {/* Right: Botanical Tree Description */}
        <div
          ref={treeDescRef}
          className="flex flex-col items-end text-right gap-1 max-w-xs pointer-events-none z-[4] mb-3 ml-auto"
        >
          <div className="text-[0.72rem] tracking-[0.22em] uppercase text-neutral-700 dark:text-neutral-300 font-semibold transition-colors duration-300">
            Prunus cerasoides · Wild Himalayan Cherry
          </div>
          <p className="text-[0.68rem] tracking-[0.05em] text-neutral-500 dark:text-neutral-400 font-light transition-colors duration-300">
            Local to Meghalaya · Blooms in November
          </p>
        </div>
      </div>
    </section>
  );
};


