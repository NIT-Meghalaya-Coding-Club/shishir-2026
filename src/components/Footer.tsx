"use client";
import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { IoMail, IoCall } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 relative overflow-hidden">
      {/* Semi-circle Background with Logo */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
        <div className="w-[200px] h-[100px] md:w-[400px] md:h-[200px] bg-gradient-to-b from-gray-800/30 via-gray-800/10 to-transparent rounded-t-full relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-36 md:h-36 flex items-center justify-center">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16">
          {/* Contact Information */}
          <div className="mb-8 md:mb-0">
            <p className="text-gray-400 font-bold">Contact:</p>
            <div className="flex items-center gap-2 mt-2">
              <IoMail className="text-gray-400" />
              <a
                href="mailto:shishir@nitm.ac.in"
                className="text-gray-200 font-bold hover:text-white hover:underline"
              >
                shishir@nitm.ac.in
              </a>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <IoCall className="text-gray-400" />
              <p className="text-gray-200 font-bold">+91-8765432190</p>
            </div>
          </div>

          {/* Address */}
          <div className="text-left md:text-right">
            <div className="flex items-center gap-2">
              <IoLocationSharp className="text-gray-400" />
              <p className="text-gray-400 font-bold">Address:</p>
            </div>
            <p className="text-gray-200 font-bold">
              Saitsohpen, Sohra (Cherrapunji),
              <br />
              East Khasi Hills District,
              <br />
              Meghalaya (India) 793108
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-8 mb-8">
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
              className="text-gray-400 hover:text-white transition-transform transform hover:scale-110"
            >
              <Icon size={24} />
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Copyright */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400">
            © Copyright 2025 | National Institute of Technology Meghalaya |
            Shishir 2025
          </p>
        </div>

        {/* Large Text */}
        <div className="flex justify-center items-center w-full mb-16">
          <h1 className="text-[8vw] md:text-[12vw] font-extrabold leading-none text-gray-800 uppercase tracking-tight">
            SHISHIR 2K25
          </h1>
        </div>
      </div>
    </footer>
  );
}