"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Blossom from "@/components/Blossom";

/**
 * Global page-transition loader.
 *
 * Shows a full-screen overlay whenever the app starts navigating to another
 * page and hides it once the new route has committed (i.e. the URL changed),
 * so a click never leaves the user without feedback on slow navigations.
 *
 * It picks up both kinds of navigation used in this app:
 * - internal <a href> clicks (captured at the document level), and
 * - programmatic pushes/replaces from `usePageRouter()`.
 *
 * The overlay waits a beat before appearing and stays up for a minimum
 * duration, so instant (prefetched) navigations don't flash it.
 */

const SHOW_DELAY_MS = 180;
const MIN_VISIBLE_MS = 350;
const SAFETY_TIMEOUT_MS = 8000;

type Listener = () => void;

const startListeners = new Set<Listener>();

function notifyNavigationStart() {
  startListeners.forEach((listener) => listener());
}

function isSameUrl(href: string) {
  try {
    const url = new URL(href, window.location.href);
    return (
      url.pathname + url.search ===
      window.location.pathname + window.location.search
    );
  } catch {
    return false;
  }
}

type AppRouter = ReturnType<typeof useRouter>;

/**
 * Drop-in replacement for `useRouter()` that tells the global
 * <PageLoader /> when a push/replace is about to happen.
 */
export function usePageRouter(): AppRouter {
  const router = useRouter();

  return useMemo<AppRouter>(() => {
    const navigate = (method: AppRouter["push"], args: Parameters<AppRouter["push"]>) => {
      if (typeof args[0] === "string" && !isSameUrl(args[0])) {
        notifyNavigationStart();
      }
      method(...args);
    };

    return {
      ...router,
      push: (...args: Parameters<AppRouter["push"]>) => navigate(router.push, args),
      replace: (...args: Parameters<AppRouter["replace"]>) => navigate(router.replace, args),
    };
  }, [router]);
}

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  const visibleRef = useRef(false);
  const shownAtRef = useRef(0);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideNow = useCallback(() => {
    visibleRef.current = false;
    setVisible(false);
  }, []);

  const scheduleShow = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

    showTimerRef.current = setTimeout(() => {
      shownAtRef.current = performance.now();
      visibleRef.current = true;
      setVisible(true);

      // Never trap the user behind the overlay if the target route never arrives.
      safetyTimerRef.current = setTimeout(hideNow, SAFETY_TIMEOUT_MS);
    }, SHOW_DELAY_MS);
  }, [hideNow]);

  // The route committed: hide, but keep the overlay up for MIN_VISIBLE_MS
  // so a navigation that was just fast enough to show it doesn't flicker.
  const finishNavigation = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    const remaining = MIN_VISIBLE_MS - (performance.now() - shownAtRef.current);
    if (visibleRef.current && remaining > 0) {
      hideTimerRef.current = setTimeout(hideNow, remaining);
    } else {
      hideNow();
    }
  }, [hideNow]);

  // The route committed (path, query, or both changed): hide the overlay.
  const urlKey = `${pathname}?${searchParams?.toString() ?? ""}`;
  useEffect(() => {
    finishNavigation();
  }, [urlKey, finishNavigation]);

  // Programmatic navigations coming from usePageRouter().
  useEffect(() => {
    startListeners.add(scheduleShow);
    return () => {
      startListeners.delete(scheduleShow);
    };
  }, [scheduleShow]);

  // Anchor navigations: show the loader as soon as an internal link is clicked.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (!isSameUrl(href)) {
        let url: URL;
        try {
          url = new URL(href, window.location.href);
        } catch {
          return;
        }
        // Only same-origin links go through the Next.js router; external
        // visits and full page loads handle their own feedback.
        if (url.origin !== window.location.origin) return;
        scheduleShow();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [scheduleShow]);

  return (
    <>
      <style>{`
        @keyframes page-loader-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .page-loader-in { animation: page-loader-in .18s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .page-loader-in { animation: none; }
        }
      `}</style>

      {visible && (
        <div
          role="status"
          aria-live="polite"
          className="page-loader-in fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-[#E0FBFC]/75 backdrop-blur-sm"
        >
          <Blossom
            className="h-14 w-14 text-[#EE6C4D] drop-shadow-[0_6px_16px_rgba(238,108,77,0.35)] motion-safe:animate-spin"
            style={{ animationDuration: "3s" }}
          />

          <p className="font-serif text-xs font-bold uppercase tracking-[0.35em] text-[#3D5A80]">
            Loading
          </p>
        </div>
      )}
    </>
  );
}
