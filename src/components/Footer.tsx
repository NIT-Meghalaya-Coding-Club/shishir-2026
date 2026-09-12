"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { IoMail } from "react-icons/io5";

export default function Footer() {
  const socialLinks = [
    { Icon: Instagram, url: "https://www.instagram.com/shishir_nitm/", label: "Instagram" },
    { Icon: Facebook, url: "https://www.facebook.com/shishirnitmeghalaya", label: "Facebook" },
    { Icon: Youtube, url: "https://www.youtube.com/@shishir_nitm", label: "YouTube" },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-white pt-12 pb-16 md:py-24 border-t border-slate-200 dark:border-white/10 z-10 select-none transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#ff8c00]/15 via-[#f43f5e]/10 to-transparent blur-[120px] rounded-full opacity-60 dark:opacity-100" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#ffd960]/10 blur-[100px] rounded-full opacity-60 dark:opacity-100" />
      </div>

      {/* ─── Vertical Links Docked on Right Side (Desktop / Tablet) ─── */}
      <div className="hidden md:flex absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-amber-400/40 to-amber-400/60" />
        {socialLinks.map(({ Icon, url, label }, index) => (
          <Link
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-white/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-md transition-all duration-300 hover:scale-115 hover:border-amber-400/60 hover:bg-amber-400/10 hover:shadow-[0_0_18px_rgba(251,191,36,0.35)]"
          >
            <Icon className="h-5 w-5 text-slate-700 dark:text-neutral-300 transition-colors duration-200 group-hover:text-amber-500 dark:group-hover:text-amber-300" />
          </Link>
        ))}
        <a
          href="mailto:shishir@nitm.ac.in"
          aria-label="Email"
          title="shishir@nitm.ac.in"
          className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-white/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-md transition-all duration-300 hover:scale-115 hover:border-amber-400/60 hover:bg-amber-400/10 hover:shadow-[0_0_18px_rgba(251,191,36,0.35)]"
        >
          <IoMail className="h-5 w-5 text-slate-700 dark:text-neutral-300 transition-colors duration-200 group-hover:text-amber-500 dark:group-hover:text-amber-300" />
        </a>
        <div className="w-[1px] h-12 bg-gradient-to-b from-amber-400/60 via-amber-400/40 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 max-w-5xl flex flex-col items-center text-center gap-6 md:gap-8 z-10">
        {/* ─── Glowing Arc Vault Over Logo (No Square Box) ─── */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative h-[85px] w-[180px] sm:h-[105px] sm:w-[220px] md:h-[125px] md:w-[260px] flex items-end justify-center">
            {/* The Semi-Circle Arc with glowing border */}
            <div className="absolute inset-0 rounded-t-full border-t-2 border-x border-amber-400/50 bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent shadow-[0_-6px_30px_rgba(251,191,36,0.3)] pointer-events-none" />
            
            {/* Pure Shishir Logo without any square box */}
            <div className="relative z-10 mb-1 sm:mb-2 hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Image
                src="/assets/logo.png"
                alt="Shishir Logo"
                width={100}
                height={100}
                priority
                className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain drop-shadow-[0_0_22px_rgba(255,160,0,0.65)]"
              />
            </div>
          </div>
        </div>

        {/* ─── Hero Titles from Outro ─── */}
        <div className="flex flex-col items-center gap-2 md:gap-3">
          <h1 className="fire-text-flow text-[clamp(3.8rem,11vw,7.5rem)] font-[900] uppercase tracking-[-0.01em] leading-[0.95] select-none">
            SHISHIR 2026
          </h1>
          <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-bold uppercase tracking-[-0.02em] leading-[1.1] bg-gradient-to-br from-slate-900 via-amber-600 to-indigo-600 dark:from-white dark:via-[#ffd960] dark:to-[#7cf5ff] bg-clip-text text-transparent transition-colors duration-300">
            Where Stars Converge
          </h2>
          <p className="text-slate-600 dark:text-[#a0aec0] text-sm md:text-base tracking-[0.06em] font-medium dark:font-light max-w-xl transition-colors duration-300">
            The Grand Cultural Extravaganza of the Northeast
          </p>
        </div>

        {/* ─── Mobile Links (Visible only on mobile devices) ─── */}
        <div className="flex md:hidden items-center justify-center gap-4">
          {socialLinks.map(({ Icon, url, label }, index) => (
            <Link
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-sm transition-all duration-300 hover:scale-115 hover:border-amber-400/50 hover:bg-amber-400/10"
            >
              <Icon className="h-4 w-4 text-slate-700 dark:text-neutral-300 transition-colors duration-200 group-hover:text-amber-500 dark:group-hover:text-amber-300" />
            </Link>
          ))}
          <a
            href="mailto:shishir@nitm.ac.in"
            aria-label="Email"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-sm transition-all duration-300 hover:scale-115 hover:border-amber-400/50 hover:bg-amber-400/10"
          >
            <IoMail className="h-4 w-4 text-slate-700 dark:text-neutral-300 transition-colors duration-200 group-hover:text-amber-500 dark:group-hover:text-amber-300" />
          </a>
        </div>

        {/* Location & Copyright */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="text-xs md:text-sm tracking-[0.25em] text-amber-600 dark:text-[#ffd960] uppercase font-bold dark:font-medium transition-colors duration-300">
            Saitsohpen, Sohra (Cherrapunji)
          </div>
          <div className="text-[0.7rem] md:text-xs text-slate-500 dark:text-[#faebd7]/50 tracking-wider transition-colors duration-300">
            All Rights reserved by National Institute of Technology, Meghalaya
          </div>
        </div>
      </div>
    </footer>
  );
}