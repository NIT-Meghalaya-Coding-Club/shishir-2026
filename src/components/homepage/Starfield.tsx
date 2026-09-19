'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  const videoRefs         = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }

    // ─── Starfield engine ───────────────────────────────────────────────
    // Optimized, serene, and gently paced starlight with zero GC stutter
    const S = {
      count:    850, // Balanced for lightweight 60fps rendering on all devices
      paletteDark:  ['#7CF5FF','#8CE0FF','#9D7CFF','#C77CFF','#FF7CE8','#FF6FB5'],
      paletteLight: ['#1E40AF','#4338CA','#6D28D9','#9333EA','#BE185D','#D97706'],
      weights:  [0.45, 0.2, 0.15, 0.125, 0.1, 0.078],
      holeR:    6,   // Tight focal singularity point
      reach:    1.35,
      minLen:   10,  maxLen:  75,
      minW:     2.0, maxW:    3.5,
      glowR:    55,  // Fades in quickly near center
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
      wid: number; colDarkRgb: string; colLightRgb: string; thr: number;
    }
    let stars: Star[] = [];

    const hexToRgbStr = (h: string): string => {
      const c = h.replace('#','');
      return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`;
    };
    const rnd  = (a: number, b: number) => a + Math.random() * (b - a);
    const pickColorStr = (palette: string[]): string => {
      let r = Math.random();
      for (let i = 0; i < palette.length; i++) { r -= S.weights[i]; if (r <= 0) return hexToRgbStr(palette[i]); }
      return hexToRgbStr(palette[0]);
    };

    const initStars = () => {
      stars = Array.from({ length: S.count }, () => {
        const a = Math.random() * Math.PI * 2;
        return {
          dx: Math.cos(a), dy: Math.sin(a), off: Math.random(),
          len: rnd(S.minLen, S.maxLen), wid: rnd(S.minW, S.maxW),
          colDarkRgb: pickColorStr(S.paletteDark),
          colLightRgb: pickColorStr(S.paletteLight),
          thr: Math.random(),
        };
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
        const fade = s.thr > S.startDen ? Math.min(1, (density - s.thr) / 0.08) : 1;

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

        const rgb = isDark ? s.colDarkRgb : s.colLightRgb;
        ctx.strokeStyle = `rgba(${rgb},${op.toFixed(2)})`;
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
    const PA = STARFIELD_TIMING.portalOpenDuration / STARFIELD_TIMING.totalTimelineDuration;
    const PC = STARFIELD_TIMING.flightPhaseEnd / STARFIELD_TIMING.totalTimelineDuration;

    const portal = portalRef.current!;

    // Initial state: 0% circle clip-path and zero opacity (no reflow layout changes!)
    gsap.set(portal, { clipPath: 'circle(0% at 50% 50%)', opacity: 0 });
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

    const ctxTimeline = gsap.context(() => {
      const tl = gsap.timeline();

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE A: Portal opens via clipPath, Logo zooms in & rotates in XY plane
      // ═══════════════════════════════════════════════════════════════════════

      // Fade in portal smoothly as expansion begins
      tl.to(portal, { opacity: 1, duration: 0.4 }, 0);

      // Portal expands from 0% circle to 120% circle (GPU composited, zero reflow!)
      tl.to(portal, {
        clipPath: 'circle(120% at 50% 50%)',
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

        // Continuous radial flight: starts right at center (0,0)
        tl.fromTo(
          videoEl,
          {
            x: 0,
            y: 0,
            scale: STARFIELD_VISUAL.initialScale,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
          },
          {
            x: () => dx * Math.hypot(window.innerWidth, window.innerHeight) * STARFIELD_VISUAL.distanceFactor,
            y: () => dy * Math.hypot(window.innerWidth, window.innerHeight) * STARFIELD_VISUAL.distanceFactor,
            scale: STARFIELD_VISUAL.exitScale,
            rotateX: rotX,
            rotateY: rotY,
            rotateZ: rotZ,
            duration: duration,
            ease: 'power1.inOut',
          },
          evt.start
        );

        // Quick fade-in as it leaves center
        tl.fromTo(
          videoEl,
          { opacity: 0 },
          { opacity: 1, duration: fadeInDuration, ease: 'power1.out' },
          evt.start
        );

        // Smooth fade-out as it zooms past screen edges
        tl.to(
          videoEl,
          { opacity: 0, duration: fadeOutDuration, ease: 'power1.in' },
          evt.end - fadeOutDuration
        );
      });

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE C: Portal shrinks to 0% circle, logo reappears with zoom-out
      // ═══════════════════════════════════════════════════════════════════════

      // Portal shrinks back to 0% circle (zero reflow!)
      tl.to(portal, {
        clipPath: 'circle(0% at 50% 50%)',
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
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   'top top',
        end:     STARFIELD_TIMING.scrollRunway,
        pin:     true,
        scrub:   0.15, // Immediately responsive to scroll speed without lagging catch-up
        animation: tl,
        onUpdate: (self) => {
          const p = self.progress;

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
            const u = (p - PC) / (1 - PC);
            starProgress = 1.0;
            starDist = 0.56 + 0.16 * (1 - Math.pow(1 - u, 1.5));
            starGlobalFade = 1;
            starExitFade = Math.max(0, 1 - Math.pow(u, 1.4));
          }

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
    }, sectionRef);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      videoRefs.current.forEach(v => {
        if (v) {
          v.pause();
        }
      });
      videoRefs.current = [];
      ctxTimeline.revert();
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="starfield-section relative w-screen h-screen overflow-hidden bg-white dark:bg-black transition-colors duration-300">

        {/* THE PORTAL: starts at 0% circle clip-path, expands to fill screen without reflow */}
        <div ref={portalRef} className="portal absolute inset-0 w-screen h-screen overflow-hidden z-[1] pointer-events-none bg-white dark:bg-black" style={{ clipPath: 'circle(0% at 50% 50%)' }}>
          <canvas ref={canvasRef} className="portal-canvas absolute inset-0 w-full h-full block" />
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
