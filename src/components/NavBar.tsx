"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LuMenu } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import NavBarItem from "./NavBarItem";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-2 left-2 right-2 z-50 mx-auto rounded-xl backdrop-blur-md shadow-lg border border-white/10"
      ref={menuRef}
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
