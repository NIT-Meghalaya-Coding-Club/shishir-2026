"use client";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { IoMail, IoCall, IoLocationSharp } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-black to-blue-950 pt-16 text-amber-100">
      {/* Animated background particles - Adjusted for better visibility on all screens */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 animate-ping rounded-full bg-amber-400"
          style={{ left: "10%", top: "20%" }}
        />
        <div
          className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 animate-ping rounded-full bg-amber-400"
          style={{ left: "80%", top: "50%", animationDelay: "1s" }}
        />
        <div
          className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 animate-ping rounded-full bg-amber-400"
          style={{ left: "30%", top: "70%", animationDelay: "2s" }}
        />
      </div>

      {/* Semi-circle Background with Logo - Improved scaling */}
      <div className="absolute left-1/2 top-5 sm:top-10 -translate-x-1/2 transform">
        <div className="relative h-[80px] w-[160px] sm:h-[100px] sm:w-[200px] md:h-[200px] md:w-[400px]">
          <div className="absolute h-full w-full rounded-t-full bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent" />
          <div className="absolute left-1/2 top-1/2 flex h-16 w-16 sm:h-24 sm:w-24 md:h-36 md:w-36 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center">
            <Image
              src="/assets/logo.png"
              alt="Shishir Logo"
              width={144}
              height={144}
              priority
              className="h-full w-full object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 sm:mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Information */}
          <div className="transform transition-all duration-300 hover:scale-105">
            <p className="text-lg font-bold text-amber-400">Contact:</p>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <IoMail className="text-amber-400 text-xl" />
                <a
                  href="mailto:shishir@nitm.ac.in"
                  className="font-bold text-amber-200 transition-colors hover:text-amber-400 hover:underline"
                >
                  shishir@nitm.ac.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <IoCall className="text-amber-400 text-xl" />
                <p className="font-bold text-amber-200">+91-8765432190</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="transform transition-all duration-300 hover:scale-105 md:text-right">
            <div className="flex items-center gap-2 md:justify-end">
              <IoLocationSharp className="text-amber-400 text-xl" />
              <p className="text-lg font-bold text-amber-400">Address:</p>
            </div>
            <p className="mt-3 font-bold text-amber-200 text-sm sm:text-base">
              Saitsohpen, Sohra (Cherrapunji),
              <br />
              East Khasi Hills District,
              <br />
              Meghalaya (India) 793108
            </p>
          </div>
        </div>

        {/* Social Links - Improved spacing and hover effects */}
        <div className="mb-8 flex justify-center gap-6 sm:gap-8">
          {[
            { Icon: Instagram, url: "https://www.instagram.com/shishir_nitm/" },
            {
              Icon: Facebook,
              url: "https://www.facebook.com/shishirnitmeghalaya",
            },
            { Icon: Youtube, url: "https://www.youtube.com/@shishir_nitm" },
          ].map(({ Icon, url }, index) => (
            <Link
              key={index}
              href={url}
              className="group relative transform transition-all duration-300 hover:scale-125"
            >
              <div className="absolute -inset-2 animate-pulse rounded-full bg-amber-400/20 opacity-0 transition-opacity group-hover:opacity-100" />
              <Icon
                size={20}
                className="text-amber-400 transition-colors group-hover:text-amber-300 sm:h-6 sm:w-6 md:h-7 md:w-7"
              />
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 sm:my-8 border-t border-amber-500/30" />

        {/* Copyright - Improved text sizing */}
        <div className="mb-6 sm:mb-8 text-center">
          <p className="text-xs sm:text-sm text-amber-300/70">
            © Copyright 2025 | National Institute of Technology Meghalaya |
            Shishir 2025
          </p>
        </div>

        {/* Large Text - More responsive font sizing */}
        <div className="mb-8 sm:mb-16 flex w-full items-center justify-center overflow-hidden">
          <h1 className="relative text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[12vw] font-extrabold uppercase tracking-tight">
            <span className="absolute -inset-2 blur-3xl">
              <span className="bg-gradient-to-r from-amber-400/20 via-amber-500/20 to-amber-600/20 bg-clip-text text-transparent">
                SHISHIR 2K25
              </span>
            </span>
            <span className="relative bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              SHISHIR 2K25
            </span>
          </h1>
        </div>
      </div>
    </footer>
  );
}
