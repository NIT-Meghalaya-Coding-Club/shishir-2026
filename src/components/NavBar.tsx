"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
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

  // Scroll behavior: hide on scroll down, reveal on scroll up or at top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isOpen) {
        setIsVisible(true);
        return;
      }

      if (currentScrollY <= 40) {
        // At the top of the page -> always visible
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        // Scrolling down deep -> hide navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

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

        {/* Right action icons: Theme toggle & Hamburger menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button (Transparent Glass Capsule) */}
          {/* <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/15 text-yellow-800 dark:text-amber-300 hover:bg-white/40 dark:hover:bg-white/15 transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 backdrop-blur-xl"
          >
            {theme === "light" ? (
              <LuMoon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 transition-transform duration-300" />
            ) : (
              <LuSun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform duration-300" />
            )}
          </button> */}

          {/* Menu Hamburger Button */}
          <div
            className="cursor-pointer text-2xl sm:text-3xl text-yellow-500 dark:text-white hover:text-amber-500 dark:hover:text-yellow-300 transition-colors duration-200 flex items-center justify-center p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10"
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
          >
            <LuMenu />
          </div>
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
            className="absolute right-3 sm:right-6 top-16 sm:top-18 w-56 rounded-2xl bg-white/20 dark:bg-black/30 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.65),inset_0_1px_2px_rgba(255,255,255,0.15)] p-4 transition-all duration-300"
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
            <li className="mt-3 pt-3 border-t border-white/30 dark:border-white/10 flex items-center justify-between px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-300">
                Theme: <span className="font-bold text-slate-900 dark:text-white capitalize">{theme}</span>
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/30 dark:bg-white/10 text-slate-800 dark:text-amber-300 hover:bg-white/50 dark:hover:bg-white/20 transition-all duration-200 border border-white/40 dark:border-white/10"
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
