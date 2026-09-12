"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { LuMenu } from "react-icons/lu";
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
      const currentScrollY = Math.max(0, window.scrollY);

      if (currentScrollY > lastScrollY.current && currentScrollY > 30) {
        // Scrolling down past threshold -> hide navbar immediately
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = null;
        }
        setIsVisible(false);
        setIsOpen(false);
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
      className="fixed top-2 left-2 right-2 z-50 mx-auto rounded-xl backdrop-blur-md shadow-lg border border-white/10"
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

        {/* Hamburger menu on the right */}
        <div
          className="cursor-pointer text-3xl text-white hover:text-yellow-300 transition-colors duration-200"
          onClick={toggleMenu}
        >
          <LuMenu />
        </div>
      </div>

      {/* Menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute right-4 top-16 w-48 rounded-xl backdrop-blur-md shadow-lg border border-white/10 p-4" // Glassmorphism effect for dropdown
          >
            <NavBarItem to="/" text="Home" onClick={closeMenu} />
            <NavBarItem to="/ticket" text="Ticket" onClick={closeMenu} />
            <NavBarItem to="/events" text="Events" onClick={closeMenu} />
            <NavBarItem to="/competitions" text="Competitions" onClick={closeMenu} />
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
  );
};

export default NavBar;
