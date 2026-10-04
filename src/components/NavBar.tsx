"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import MenuToggle from "./MenuToggle";
import { motion, AnimatePresence } from "framer-motion";
import NavBarItem from "./NavBarItem";
import Image from "next/image";
import { useRouter } from "next/navigation";


const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);
  const isOpenRef = useRef(false);
  const isVisibleRef = useRef(true);
  const router = useRouter();

  const { status } = useSession();

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

  // Scroll behavior: hide on scroll down, reveal on scroll up or at top
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

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
    if (!isVisibleRef.current) {
      setIsVisible(true);
    }
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
        if (!isHoveredRef.current && !isOpenRef.current && isVisibleRef.current) {
          setIsVisible(false);
        }
      } else if (currentScrollY < lastScrollY.current || currentScrollY <= 10) {
        // Scrolling up or top of page -> show navbar and reset timer
        showNavbarAndResetTimer();
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <>
      {/* Hover trigger zone: reveals navbar when it's hidden and mouse hits top edge.
          Only mounted while hidden so it never blocks clicks on page content. */}
      {!isVisible && (
        <div
          onMouseEnter={showNavbarAndResetTimer}
          className="fixed top-0 left-0 right-0 h-20 z-40"
          aria-hidden="true"
        />
      )}
    <motion.nav
      id="main-navbar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetInactivityTimer();
      }}
      initial={{ opacity: 0, y: -50 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -100,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-3 left-3 right-3 sm:left-6 sm:right-6 lg:left-8 lg:right-8 z-50 mx-auto max-w-7xl rounded-full bg-gradient-to-b  from-white/10 via-white/[0.02] to-white/[0.05] dark:from-white/[0.07] dark:via-transparent dark:to-white/[0.02] backdrop-blur-sm  backdrop-saturate-200 backdrop-contrast-125 backdrop-brightness-105 border border-white/40 dark:border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_2px_0_rgba(255,255,255,0.6),inset_0_-1px_1px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_2px_0_rgba(255,255,255,0.25),inset_0_-1px_1px_0_rgba(0,0,0,0.4)] transition-all duration-300"
      ref={menuRef}
    >
      <div className="container mx-auto flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5">
        {/* Logo with onClick handler */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center cursor-pointer"
          onClick={navigateToHome}
        >
          <Image
            src="/assets/logo.png"
            alt="SHISHIR Crest Logo"
            width={44}
            height={44}
            priority
            className="h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-sm select-none"
          />
        </motion.div>

        <div className="flex items-center gap-2.5 sm:gap-3">


          {/* Menu Hamburger Button */}
          <MenuToggle isOpen={isOpen} onClick={toggleMenu} />
        </div>
      </div>

      {/* Menu dropdown with matching Pure Glassmorphism */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-3 sm:right-6 top-[70px] sm:top-18 w-56 rounded-2xl bg-white/20 dark:bg-black/30 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.65),inset_0_1px_2px_rgba(255,255,255,0.15)] p-4 transition-all duration-300"
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
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
    </>
  );
};

export default NavBar;
