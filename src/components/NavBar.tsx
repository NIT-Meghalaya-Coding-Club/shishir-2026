"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { LuMenu, LuSun, LuMoon } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import NavBarItem from "./NavBarItem";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);
  const isOpenRef = useRef(false);
  const router = useRouter();

  const { status } = useSession();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigate to home page when logo is clicked
  const navigateToHome = () => {
    router.push("/");
  };

  useEffect(() => {
    const updateNavHeight = () => {
      if (menuRef.current) {
        const height = menuRef.current.offsetHeight;
        const computedTop = parseFloat(window.getComputedStyle(menuRef.current).top) || 8;
        const totalHeight = height + computedTop;
        document.documentElement.style.setProperty("--navbar-height", `${height}px`);
        document.documentElement.style.setProperty("--navbar-total-height", `${totalHeight}px`);
      }
    };

    updateNavHeight();
    const timer = setTimeout(updateNavHeight, 550);
    window.addEventListener("resize", updateNavHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateNavHeight);
    };
  }, []);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    // Do not hide if user is hovering over navbar or dropdown is open
    if (isHoveredRef.current || isOpenRef.current) {
      return;
    }

    inactivityTimerRef.current = setTimeout(() => {
      if (!isHoveredRef.current && !isOpenRef.current) {
        setIsVisible(false);
      }
    }, 3000);
  }, []);

  const showNavbarAndResetTimer = useCallback(() => {
    setIsVisible(true);
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      // Keep navbar visible when menu is open
      setIsVisible(true);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    } else {
      resetInactivityTimer();
    }
  }, [isOpen, resetInactivityTimer]);

  useEffect(() => {
    // Start initial 3s countdown on mount
    resetInactivityTimer();

    const handleUserActivity = () => {
      showNavbarAndResetTimer();
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        // Scrolling down -> hide navbar unless hovering or open
        if (!isHoveredRef.current && !isOpenRef.current) {
          setIsVisible(false);
        }
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up -> show navbar and reset timer
        showNavbarAndResetTimer();
      } else if (currentScrollY <= 10) {
        // Top of page -> show navbar and reset timer
        showNavbarAndResetTimer();
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleUserActivity, { passive: true });
    window.addEventListener("touchstart", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, [resetInactivityTimer, showNavbarAndResetTimer]);

  return (
    <motion.nav
      id="main-navbar"
      initial={{ opacity: 0, y: -50 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -100,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-2 left-2 right-2 z-50 mx-auto rounded-xl backdrop-blur-md shadow-lg border bg-white/80 dark:bg-black/80 border-slate-200/80 dark:border-white/10 transition-colors duration-300"
      ref={menuRef}
      onMouseEnter={() => {
        setIsHovered(true);
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = null;
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        resetInactivityTimer();
      }}
    >
      <div className="container mx-auto flex items-center justify-between p-2">
        {/* Logo with onClick handler */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center cursor-pointer"
          onClick={navigateToHome} // Redirect to home page on click
        >
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={48}
            height={48}
            priority
            className="h-12 w-12"
          />
        </motion.div>

        {/* Right action icons: Theme toggle & Hamburger menu */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100/90 dark:bg-white/[0.08] border border-slate-200 dark:border-white/15 text-slate-800 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-white/[0.15] transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            {theme === "light" ? (
              <LuMoon className="w-5 h-5 text-indigo-600 transition-transform duration-300" />
            ) : (
              <LuSun className="w-5 h-5 text-amber-400 transition-transform duration-300" />
            )}
          </button>

          <div
            className="cursor-pointer text-3xl text-slate-800 dark:text-white hover:text-amber-500 dark:hover:text-yellow-300 transition-colors duration-200 flex items-center justify-center p-1"
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
          >
            <LuMenu />
          </div>
        </div>
      </div>

      {/* Menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute right-4 top-16 w-52 rounded-xl backdrop-blur-md shadow-2xl border bg-white/95 dark:bg-black/90 border-slate-200 dark:border-white/10 p-4 transition-colors duration-300"
          >
            <NavBarItem to="/" text="Home" onClick={closeMenu} />
            <NavBarItem to="/ticket" text="Ticket" onClick={closeMenu} />
            <NavBarItem to="/events" text="Events" onClick={closeMenu} />
            <NavBarItem to="/schedule" text="Schedule" onClick={closeMenu} />
            <NavBarItem to="/mun" text="MUN" onClick={closeMenu} />
            <NavBarItem to="/sponsors" text="Sponsors" onClick={closeMenu} />
            <NavBarItem to="/team" text="Team" onClick={closeMenu} />
            {status === "unauthenticated" && (
              <NavBarItem to="/register" text="Login" onClick={closeMenu} />
            )}
            {status === "authenticated" && (
              <NavBarItem to="/dashboard" text="Dashboard" onClick={closeMenu} />
            )}

            {/* Quick theme switch inside menu */}
            <li className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                Theme: <span className="font-bold text-slate-900 dark:text-white capitalize">{theme}</span>
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-all duration-200"
              >
                {theme === "light" ? <LuMoon className="w-3.5 h-3.5 text-indigo-600" /> : <LuSun className="w-3.5 h-3.5 text-amber-400" />}
                <span>Toggle</span>
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;
