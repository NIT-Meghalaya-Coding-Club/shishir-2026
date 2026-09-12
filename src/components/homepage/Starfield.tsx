'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  getResolvedStarfieldVideos,
  STARFIELD_TIMING,
  STARFIELD_VISUAL,
} from '@/config/starfieldVideos';

// Resolved video list (derived dynamically from src/config/starfieldVideos.ts)
const STARFIELD_VIDEOS = getResolvedStarfieldVideos();

export const Starfield: React.FC = () => {
  const sectionRef        = useRef<HTMLDivElement>(null);
  const portalRef         = useRef<HTMLDivElement>(null);
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const logoWrapRef       = useRef<HTMLDivElement>(null);
  const logoInnerRef      = useRef<HTMLDivElement>(null);
  const lenisRef          = useRef<Lenis | null>(null);
  const videoRefs         = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }

    // ─── Smooth Scroll Coordination ─────────────────────────────────────
    // If a global smooth scroll instance (e.g. from ClientProviders / SmoothScroll.tsx)
    // already exists on window.lenis, reuse it to prevent duplicate scroll listeners!
    const existingLenis = (window as unknown as { lenis?: Lenis; __lenis?: Lenis }).lenis || null;
    let lenis = existingLenis;
    let createdLocalLenis = false;

    let tick: ((time: number) => void) | null = null;

    if (!lenis) {
      lenis = new Lenis({
        lerp: 0.08,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.3,
        smoothWheel: true,
        syncTouch: true,
        virtualScroll: (data) => {
          const MAX_DELTA = 48;
          if (data.deltaY > MAX_DELTA) {
            data.deltaY = MAX_DELTA;
          } else if (data.deltaY < -MAX_DELTA) {
            data.deltaY = -MAX_DELTA;
          }
          return true;
        },
      });
      createdLocalLenis = true;
      (window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;

      lenis.on('scroll', () => {
        ScrollTrigger.update();
      });

      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
    }
    lenisRef.current = lenis;

    // ─── Starfield engine ───────────────────────────────────────────────
    // Optimized, serene, and gently paced starlight
    const S = {
      count:    1100, // Balanced for lightweight rendering on weaker devices
      paletteDark:  ['#7CF5FF','#8CE0FF','#9D7CFF','#C77CFF','#FF7CE8','#FF6FB5'],
      paletteLight: ['#1E40AF','#4338CA','#6D28D9','#9333EA','#BE185D','#D97706'],
      weights:  [0.45, 0.2, 0.15, 0.125, 0.1, 0.078],
      holeR:    6,   // Tight focal singularity point (no large black spot)
      reach:    1.35,
      minLen:   10,  maxLen:  75,  // Shorter, elegant celestial streaks (no rushed blur)
      minW:     2.0, maxW:    3.5,
      glowR:    55,  // Fades in quickly near center (no hollow void)
      glowSoft: 1.2, // Gentle linear fade-in
      tailFade: 0.25,
      startDen: 0.22,
    };

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    let W = 0, H = 0, cx = 0, cy = 0, maxD = 0, dpr = 1;
    let starProgress = 0;
    let starDist = 0;
    let starGlobalFade = 0;
    let starExitFade = 1;

    interface Star {
      dx: number; dy: number; off: number; len: number;
      wid: number; colDark: [number,number,number]; colLight: [number,number,number]; thr: number;
    }
    let stars: Star[] = [];

    const hex = (h: string): [number,number,number] => {
      const c = h.replace('#','');
      return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)];
    };
    const rnd  = (a: number, b: number) => a + Math.random() * (b - a);
    const pickColor = (palette: string[]): [number,number,number] => {
      let r = Math.random();
      for (let i = 0; i < palette.length; i++) { r -= S.weights[i]; if (r <= 0) return hex(palette[i]); }
      return hex(palette[0]);
    };

    const initStars = () => {
      stars = Array.from({ length: S.count }, () => {
        const a = Math.random() * Math.PI * 2;
        return { dx: Math.cos(a), dy: Math.sin(a), off: Math.random(),
                 len: rnd(S.minLen, S.maxLen), wid: rnd(S.minW, S.maxW),
                 colDark: pickColor(S.paletteDark), colLight: pickColor(S.paletteLight), thr: Math.random() };
      });
    };

    const resizeCanvas = () => {
      // Cap DPR at 1.5 to dramatically reduce fillrate and GPU load on weaker devices
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2;
      maxD = Math.hypot(W / 2, H / 2) * S.reach;
    };

    const drawStarfield = () => {
      ctx.clearRect(0, 0, W, H);
      // Strictly blank on landing page or when fully faded out
      if (starProgress <= 0.002 || starExitFade <= 0.001) return;

      ctx.lineCap = 'round';
      const density = S.startDen + starProgress * (1 - S.startDen);
      const thick   = (1 - starProgress) * 1.5 + starProgress * 0.6;
      const stretch = (1 - starProgress) * 0.4 + starProgress * 0.9;

      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

      // Radiant central core: completely banishes any central black void
      if (starProgress > 0.02) {
        const coreOp = Math.min(0.55, starProgress * 0.55) * starGlobalFade * starExitFade;
        if (coreOp > 0.01) {
          const coreGr = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
          if (isDark) {
            coreGr.addColorStop(0, `rgba(255, 255, 255, ${coreOp * 0.85})`);
            coreGr.addColorStop(0.35, `rgba(124, 245, 255, ${coreOp * 0.45})`);
            coreGr.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else {
            coreGr.addColorStop(0, `rgba(217, 119, 6, ${coreOp * 0.65})`);
            coreGr.addColorStop(0.35, `rgba(79, 70, 229, ${coreOp * 0.45})`);
            coreGr.addColorStop(1, 'rgba(255, 255, 255, 0)');
          }
          ctx.fillStyle = coreGr;
          ctx.beginPath();
          ctx.arc(cx, cy, 40, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const s of stars) {
        if (s.thr > density) continue;
        let fade = s.thr > S.startDen ? Math.min(1, (density - s.thr) / 0.08) : 1;

        // Monotonic outward travel: strictly advances forward with starDist, never reverses
        const travel = ((starDist + s.off) % 1 + 1) % 1;
        const headD  = S.holeR + travel * (maxD - S.holeR);
        const sLen   = s.len * (0.25 + travel * 0.75) * stretch;
        const tailD  = Math.max(S.holeR, headD - sLen);

        const tx = cx + s.dx * tailD, ty = cy + s.dy * tailD;
        const hx = cx + s.dx * headD, hy = cy + s.dy * headD;

        let op = fade * starGlobalFade * starExitFade;
        if (headD < S.glowR) {
          const t = (headD - S.holeR) / (S.glowR - S.holeR);
          op *= Math.pow(Math.max(0, t), S.glowSoft);
        }
        if (op <= 0.01) continue;

        const [r, g, b] = isDark ? s.colDark : s.colLight;
        const gr = ctx.createLinearGradient(tx, ty, hx, hy);
        gr.addColorStop(0,          `rgba(${r},${g},${b},0)`);
        gr.addColorStop(S.tailFade, `rgba(${r},${g},${b},${op})`);
        gr.addColorStop(1,          `rgba(${r},${g},${b},${op})`);

        ctx.strokeStyle = gr;
        ctx.lineWidth   = s.wid * thick * (0.6 + travel * 0.8);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();
      }
    };

    initStars();
    resizeCanvas();
    drawStarfield();
    const onResize = () => { resizeCanvas(); drawStarfield(); };
    window.addEventListener('resize', onResize);

    // ─── Mouse parallax on landing page ──────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      if (!logoInnerRef.current || starProgress > 0.05) return;
      const xn = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const yn = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      gsap.to(logoInnerRef.current, {
        rotateZ: xn * 5, rotateY: xn * 8, rotateX: -yn * 8,
        duration: 0.6, ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', onMouse);

    // ─── Timeline Architecture ──────────────────────────────────────────
    // Total duration: 14 units
    // Phase A (0.0 → 2.2): Portal grows from 0px (0 → 0.157 scroll)
    //   - Starlight accelerates gently inside growing div
    //   - Logo zooms (1.0 → 3.8), rotates in the XY plane (rotateZ: -28 deg), fades out cleanly by 2.2
    //
    // Phase B (2.2 → 11.0): Fullscreen starfield + 10 Shishir Events (0.157 → 0.786 scroll)
    //   - Each wave is 1.9 units long
    //   - Slower typing cadence (stagger: 0.044) with ample rest time where text is 100% typed out
    //   - While exiting: texts fly outward with the stars along radial hyperspace trajectories
    //
    // Phase C (11.2 → 14.0): Portal shrinks to 0px & Logo zoom-out (0.786 → 1.000 scroll)
    //   - Starlight CONTINUES TO STREAM OUTWARD (never reverses direction) while gently fading
    //   - Portal shrinks back to 0px circle
    //   - Logo appears with zoom-out feeling and smooth XY un-rotation (scale 3.8 → 1.0, rotateZ: -28 → 0)
    //
    const PA = STARFIELD_TIMING.portalOpenDuration / STARFIELD_TIMING.totalTimelineDuration;
    const PC = STARFIELD_TIMING.flightPhaseEnd / STARFIELD_TIMING.totalTimelineDuration;

    const portal = portalRef.current!;

    // Initial state: ZERO pixels and zero opacity so no circle is visible behind the image
    gsap.set(portal, { width: 0, height: 0, borderRadius: '50%', opacity: 0 });
    if (logoWrapRef.current) {
      gsap.set(logoWrapRef.current, {
        scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0,
        opacity: 1, transformPerspective: 1000,
      });
    }

    // Safe play/pause helpers to avoid unhandled browser abort exceptions
    const safePlay = (video: HTMLVideoElement | null) => {
      if (!video) return;
      video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    };

    const safePause = (video: HTMLVideoElement | null) => {
      if (!video) return;
      video.pause();
    };

    // =========================================================================
    // 💡 VIDEO INITIALIZATION
    // All videos start hidden at the center vanishing point (0, 0)
    //
    // 🔍 SCALE PARAMETER 1: Initial Scale (at center singularity)
    // Defined in src/config/starfieldVideos.ts -> STARFIELD_VISUAL.initialScale
    // (Default: 0.08. Lower = tinier starting point, Higher = larger starting point)
    // =========================================================================
    STARFIELD_VIDEOS.forEach((_, idx) => {
      const el = document.getElementById(`event-video-${idx}`);
      if (el) {
        gsap.set(el, {
          opacity: 0,
          x: 0,
          y: 0,
          scale: STARFIELD_VISUAL.initialScale,
          xPercent: -50,
          yPercent: -50,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          transformPerspective: 1200,
        });
      }
    });

    const tl = gsap.timeline();

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE A: Portal opens from 0px, Logo zooms in & rotates in XY plane
    // ═══════════════════════════════════════════════════════════════════════

    // Fade in portal smoothly as expansion begins
    tl.to(portal, { opacity: 1, duration: 0.4 }, 0);

    // Portal expands from 0px as a TRUE PERFECT CIRCLE to cover fullscreen
    tl.to(portal, {
      width: () => Math.hypot(window.innerWidth, window.innerHeight) * 1.05,
      height: () => Math.hypot(window.innerWidth, window.innerHeight) * 1.05,
      borderRadius: '50%',
      ease: 'power2.inOut',
      duration: STARFIELD_TIMING.portalOpenDuration,
    }, 0);

    // Logo zooms in with rotation in the XY plane (no 3D tilt)
    tl.to(logoWrapRef.current, {
      scale: 3.8, rotateZ: -28, rotateX: 0, rotateY: 0,
      ease: 'power1.inOut',
      duration: STARFIELD_TIMING.portalOpenDuration,
    }, 0);

    // Logo fades out cleanly as portal reaches fullscreen
    tl.to(logoWrapRef.current, {
      opacity: 0,
      ease: 'power2.in',
      duration: 1.2,
    }, 1.0);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE B: Continuous Stream of Shishir Event Videos
    //
    // 🔍 WHERE TO CHANGE TIMING, FLIGHT DURATION & SCROLL LENGTH:
    //    All controls are in `src/config/starfieldVideos.ts`:
    //
    //  ⏱️ 1. VIDEO FLIGHT DURATION (how long each video card is on screen):
    //     -> `STARFIELD_TIMING.videoFlightDuration` (Default: 4.2s)
    //
    //  ⏱️ 2. TIME GAP BETWEEN VIDEOS (time before next video emerges):
    //     -> `STARFIELD_TIMING.timeBetweenVideos` (Default: 1.35s)
    //     (4.2 / 1.35 ≈ 3.1 -> exactly 3 concurrent videos on screen at any time)
    //
    //  📜 3. SCROLL RUNWAY (how much scrolling is required for the whole section):
    //     -> `STARFIELD_TIMING.scrollRunway` (Default: '+=2000%')
    //
    //  🔍 WHERE TO CHANGE VIDEO SCALING & SIZING:
    //  1. BASE CARD DIMENSIONS: `STARFIELD_VISUAL.cardWidthClass`
    //  2. STARTING SCALE (at center): `STARFIELD_VISUAL.initialScale` (Default: 0.06)
    //  3. MAXIMUM / EXIT SCALE: `STARFIELD_VISUAL.exitScale` (Default: 2.7)
    //  4. FLIGHT DISTANCE: `STARFIELD_VISUAL.distanceFactor` (Default: 0.85)
    // ═══════════════════════════════════════════════════════════════════════

    STARFIELD_VIDEOS.forEach((evt, idx) => {
      const videoEl = document.getElementById(`event-video-${idx}`);
      if (!videoEl) return;

      const rad = (evt.angleDeg * Math.PI) / 180;
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);

      // 3D Tilt angles along trajectory of movement (dynamic banking)
      const rotX = -dy * 26;
      const rotY = dx * 28;
      const rotZ = Math.max(-22, Math.min(22, evt.angleDeg * 0.16));

      const duration = evt.end - evt.start;
      const fadeInDuration = Math.min(0.5, duration * 0.14);
      const fadeOutDuration = Math.min(0.6, duration * 0.16);

      // Continuous radial flight: starts right at center (0,0), giving maximum run-time on screen
      tl.fromTo(
        videoEl,
        {
          x: 0,
          y: 0,
          scale: STARFIELD_VISUAL.initialScale, // 👈 [SCALE PARAMETER 1] Starting scale at center
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
        },
        {
          x: () => dx * Math.hypot(window.innerWidth, window.innerHeight) * STARFIELD_VISUAL.distanceFactor,
          y: () => dy * Math.hypot(window.innerWidth, window.innerHeight) * STARFIELD_VISUAL.distanceFactor,
          scale: STARFIELD_VISUAL.exitScale,     // 👈 [SCALE PARAMETER 2] Maximum exit scale as it zooms past screen!
          rotateX: rotX,
          rotateY: rotY,
          rotateZ: rotZ,
          duration: duration,
          ease: 'power1.inOut',                  // Organic acceleration from center to outer edges
        },
        evt.start
      );

      // Quick fade-in as it leaves the center singularity
      tl.fromTo(
        videoEl,
        { opacity: 0 },
        { opacity: 1, duration: fadeInDuration, ease: 'power1.out' },
        evt.start
      );

      // Smooth fade-out as it zooms past the screen edges
      tl.to(
        videoEl,
        { opacity: 0, duration: fadeOutDuration, ease: 'power1.in' },
        evt.end - fadeOutDuration
      );
    });

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE C: Portal shrinks to 0px, logo reappears with zoom-out
    // ═══════════════════════════════════════════════════════════════════════

    // Portal shrinks all the way back to 0px circle (no residual circle!)
    tl.to(portal, {
      width: 0, height: 0, borderRadius: '50%',
      ease: 'power2.inOut',
      duration: STARFIELD_TIMING.portalCloseDuration,
    }, STARFIELD_TIMING.portalCloseStart);

    tl.to(portal, {
      opacity: 0,
      duration: 0.4,
    }, STARFIELD_TIMING.portalCloseStart + STARFIELD_TIMING.portalCloseDuration - 0.2);

    // Logo appears again with zoom-out feeling and un-rotation in the XY plane
    tl.fromTo(logoWrapRef.current,
      { scale: 3.8, rotateZ: -28, rotateX: 0, rotateY: 0, opacity: 0 },
      {
        scale: 1, rotateZ: 0, rotateX: 0, rotateY: 0, opacity: 1,
        ease: 'power2.out',
        duration: 2.4,
        immediateRender: false,
      },
      STARFIELD_TIMING.portalCloseStart + 0.1,
    );

    // ═══════════════════════════════════════════════════════════════════════
    // ScrollTrigger with STRICTLY MONOTONIC OUTWARD STAR MOVEMENT
    // ═══════════════════════════════════════════════════════════════════════

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top top',
      end:     STARFIELD_TIMING.scrollRunway, // Doubled scroll runway for spacious, unhurried pacing
      pin:     true,
      scrub:   0.25, // Tightly coupled with Lenis lerp: 0.08 for zero-lag professional glide
      animation: tl,
      onUpdate: (self) => {
        const p = self.progress;

        // STRICTLY MONOTONIC OUTWARD DISTANCE:
        // Paced gently and serenely so stars drift smoothly outward without rushing.
        if (p <= 0.002) {
          starProgress = 0;
          starDist = 0;
          starGlobalFade = 0;
          starExitFade = 1;
        } else if (p <= PA) {
          const u = p / PA;
          starProgress = u * 0.35;
          starDist = 0.08 * Math.pow(u, 1.3);
          starGlobalFade = Math.min(1, u / 0.2);
          starExitFade = 1;
        } else if (p <= PC) {
          const u = (p - PA) / (PC - PA);
          starProgress = 0.35 + 0.65 * u;
          starDist = 0.08 + 0.48 * u;
          starGlobalFade = 1;
          starExitFade = 1;
        } else {
          // Phase C: p > PC (0.786 → 1.0)
          const u = (p - PC) / (1 - PC);
          starProgress = 1.0;
          // Starlight CONTINUES TO FLOW OUTWARD gently at half speed, never reverses
          starDist = 0.56 + 0.16 * (1 - Math.pow(1 - u, 1.5));
          starGlobalFade = 1;
          // Exit fade smoothly dims the stars
          starExitFade = Math.max(0, 1 - Math.pow(u, 1.4));
        }

        // Efficient video playback management:
        // Only active videos currently streaming decode & play; inactive ones pause to keep 60+ FPS
        const currentTime = tl.time();
        STARFIELD_VIDEOS.forEach((evt, idx) => {
          const isActive = currentTime >= evt.start - 0.15 && currentTime <= evt.end + 0.15;
          const v = videoRefs.current[idx];
          if (!v) return;
          if (isActive) {
            if (v.paused) safePlay(v);
          } else {
            if (!v.paused) safePause(v);
          }
        });

        drawStarfield();
      },
    });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      videoRefs.current.forEach(v => {
        if (v) {
          v.pause();
        }
      });
      videoRefs.current = [];
      trigger.kill();
      tl.kill();
      if (tick) {
        gsap.ticker.remove(tick);
      }
      if (createdLocalLenis && lenis) {
        lenis.destroy();
      }
      lenisRef.current = null;
      if (typeof window !== 'undefined' && createdLocalLenis) {
        (window as unknown as { __lenis?: Lenis | null }).__lenis = null;
      }
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="starfield-section relative w-screen h-screen overflow-hidden bg-white dark:bg-black transition-colors duration-300">

        {/* THE PORTAL: starts at 0px circle, expands to fill screen.
            The starfield canvas lives inside it and is clipped by it. */}
        <div ref={portalRef} className="portal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full overflow-hidden z-[1] pointer-events-none bg-white dark:bg-black">
          <canvas ref={canvasRef} className="portal-canvas absolute w-screen h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block" />
        </div>

        {/* Shishir Event Videos: continuous stream configured via src/config/starfieldVideos.ts */}
        <div className="events-container absolute top-0 left-0 w-screen h-screen pointer-events-none z-[2] overflow-hidden [perspective:1200px]">
          {STARFIELD_VIDEOS.map((evt, index) => (
            <div
              key={evt.id}
              id={`event-video-${index}`}
              className="event-floating-video absolute top-1/2 left-1/2 pointer-events-none opacity-0 will-change-[transform,opacity] [transform-style:preserve-3d]"
              style={{ transformOrigin: 'center center' }}
            >
              <div
                className={`relative group overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/30 bg-white/95 dark:bg-black/75 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_0_40px_rgba(124,245,255,0.32),inset_0_0_15px_rgba(255,255,255,0.08)] aspect-video ${STARFIELD_VISUAL.cardWidthClass} transition-colors duration-300`}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                    if (el) el.muted = true;
                  }}
                  src={evt.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="text-[clamp(0.75rem,1.2vw,0.95rem)] font-bold tracking-wider text-white uppercase font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate mr-2">
                    {evt.name}
                  </span>
                  {/* <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#7CF5FF] shrink-0" /> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LOGO: sits on top of portal. Visible on landing page (scale 1) and outro (zoomed out) */}
        <div className="logo-overlay absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[4] pointer-events-none [perspective:1000px] [transform-style:preserve-3d]">
          <div ref={logoWrapRef} className="logo-wrapper [transform-style:preserve-3d] will-change-transform opacity-100 scale-100 flex justify-center items-center">
            <div ref={logoInnerRef} className="logo-inner [transform-style:preserve-3d] will-change-transform">
              <img
                src="/assets/logo.png"
                alt="SHISHIR 2026 - NIT Meghalaya"
                className="logo-image w-[clamp(160px,22vw,320px)] h-auto object-contain select-none pointer-events-none"
                draggable={false}
              />
              
            </div>
          </div>
        </div>

      </section>

      
    </>
  );
};
