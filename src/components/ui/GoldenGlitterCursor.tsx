'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  glowColor: string;
  rotation: number;
  spin: number;
  isStar: boolean;
}

const GOLD_PALETTE = [
  { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.95)' },      // Diamond white flare
  { color: '#fff6c2', glow: 'rgba(255, 235, 130, 0.9)' },       // Champagne starlight
  { color: '#ffd700', glow: 'rgba(255, 215, 0, 0.85)' },        // Pure radiant gold
  { color: '#ffb703', glow: 'rgba(255, 183, 3, 0.8)' },         // Amber flame gold
  { color: '#ffe484', glow: 'rgba(254, 240, 138, 0.85)' },      // Warm starlight
];

export const GoldenGlitterCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate on devices with a mouse/trackpad pointer
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const MAX_PARTICLES = 100;

    let lastX = -100;
    let lastY = -100;

    // Draw 4-point golden sparkle star
    const drawStar = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      angle: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(
          Math.cos((i * Math.PI) / 2) * radius,
          Math.sin((i * Math.PI) / 2) * radius
        );
        c.lineTo(
          Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (radius * 0.2),
          Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (radius * 0.2)
        );
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    const spawnSparkle = (px: number, py: number, extraBurst = false) => {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift();
      }

      const selected = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];
      const isStar = Math.random() < 0.65;
      const speed = extraBurst ? 2.5 + Math.random() * 3.5 : 0.4 + Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;

      particles.push({
        x: px + (Math.random() - 0.5) * 4,
        y: py + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (extraBurst ? 0.6 : 0.25),
        size: isStar ? 3.5 + Math.random() * 4.5 : 1.8 + Math.random() * 2.5,
        alpha: 0.95 + Math.random() * 0.05,
        decay: extraBurst ? 0.016 + Math.random() * 0.02 : 0.022 + Math.random() * 0.028,
        color: selected.color,
        glowColor: selected.glow,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.12,
        isStar,
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // 1. Direct hardware transform for the perfectly concentric cursor
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // 2. Spawn golden glitter particles along cursor movement
      if (lastX !== -100) {
        const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
        const steps = Math.min(Math.max(Math.floor(dist / 10), 1), 5);

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const curX = lastX + (mouseX - lastX) * t;
          const curY = lastY + (mouseY - lastY) * t;
          spawnSparkle(curX, curY);
          if (Math.random() < 0.25) {
            spawnSparkle(curX, curY);
          }
        }
      } else {
        spawnSparkle(mouseX, mouseY);
      }

      lastX = mouseX;
      lastY = mouseY;

      // Check hover on interactive items
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      // Celebratory burst on click
      for (let i = 0; i < 16; i++) {
        spawnSparkle(e.clientX, e.clientY, true);
      }
    };

    const onMouseUp = () => setIsClicked(false);

    const onMouseLeave = () => {
      setIsVisible(false);
      lastX = -100;
      lastY = -100;
    };

    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // Soft fairy dust buoyancy
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;
        p.rotation += p.spin;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = p.size * 1.6;

        if (p.isStar) {
          drawStar(ctx, p.x, p.y, p.size * (p.alpha * 0.8 + 0.2), p.rotation);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* ─── Perfectly Concentric Gold Dot & Symmetrical Ring ─── */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100000] flex items-center justify-center will-change-transform transition-opacity duration-150 select-none"
        style={{
          opacity: isVisible ? 1 : 0,
          width: '44px',
          height: '44px',
        }}
      >
        {/* Symmetrical Outer Golden Ring */}
        <div
          className={`rounded-full border border-amber-400/70 flex items-center justify-center transition-all duration-200 ease-out ${
            isClicked
              ? 'w-6 h-6 border-amber-300 bg-amber-400/30 scale-90'
              : isHovered
              ? 'w-10 h-10 border-amber-300 bg-amber-400/15 backdrop-blur-[1px] shadow-[0_0_18px_rgba(251,191,36,0.5)]'
              : 'w-7 h-7 bg-amber-400/5 shadow-[0_0_10px_rgba(251,191,36,0.25)]'
          }`}
        >
          {/* Centered Luminous Gold Dot */}
          <div
            className={`rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-white shadow-[0_0_8px_rgba(255,215,0,0.95)] transition-transform duration-150 ${
              isClicked ? 'w-1 h-1' : isHovered ? 'w-2 h-2 scale-125' : 'w-1.5 h-1.5'
            }`}
          />
        </div>
      </div>

      {/* ─── Golden Glitter Particle Trail Canvas ─── */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[99999] h-screen w-screen select-none"
        aria-hidden="true"
      />
    </>
  );
};

export default GoldenGlitterCursor;
