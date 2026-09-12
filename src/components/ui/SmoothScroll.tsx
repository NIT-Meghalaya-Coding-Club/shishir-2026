'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Global Smooth Scroll Provider (Lenis + GSAP ScrollTrigger)
 * 
 * Provides:
 * 1. Silky, physics-based inertial scrolling across the entire project
 * 2. Perfect frame-by-frame synchronization with GSAP ScrollTrigger
 * 3. Smooth anchor-link navigation for internal page jumps (e.g. href="#about")
 * 4. Velocity dampening to prevent fast wheel flicks from skipping pinned sections
 * 5. Automatic ScrollTrigger refreshes on window resize and route transitions
 */
export const SmoothScroll: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Register GSAP plugins safely on client
    gsap.registerPlugin(ScrollTrigger);

    // Disable browser scroll restoration to prevent jumpy reloads
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }

    // 1. Initialize Lenis with tuned inertia and velocity limiter
    const lenis = new Lenis({
      lerp: 0.085,             // Silky physics-based deceleration curve
      wheelMultiplier: 1.0,    // Natural 1:1 wheel sensitivity
      touchMultiplier: 1.2,    // Responsive mobile touch scrolling
      smoothWheel: true,       // Enable smooth wheel interpolation
      syncTouch: false,        // Native touch scroll feeling on mobile
      virtualScroll: (data) => {
        // Prevent aggressive mousewheel flicking from blowing past pinned sections
        const MAX_DELTA = 48;
        if (data.deltaY > MAX_DELTA) {
          data.deltaY = MAX_DELTA;
        } else if (data.deltaY < -MAX_DELTA) {
          data.deltaY = -MAX_DELTA;
        }
        return true;
      },
    });

    lenisRef.current = lenis;

    // Expose on window for components or debugging
    if (typeof window !== 'undefined') {
      (window as unknown as { lenis: Lenis; __lenis: Lenis }).lenis = lenis;
      (window as unknown as { lenis: Lenis; __lenis: Lenis }).__lenis = lenis;
    }

    // 2. Synchronize Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Drive Lenis updates directly through GSAP's optimized ticker loop
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // 4. Smooth Anchor Link Interceptor:
    // Any click on an internal hash link (#about, #events, etc.) scrolls with silky Lenis ease
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -70,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Initial ScrollTrigger refresh once DOM is fully parsed
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    // Cleanup on unmount
    return () => {
      clearTimeout(refreshTimer);
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        delete (window as unknown as { lenis?: Lenis }).lenis;
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
    };
  }, []);

  // Smoothly reset scroll position and recalculate trigger markers on page route changes
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    }
  }, [pathname]);

  return null;
};

export default SmoothScroll;
