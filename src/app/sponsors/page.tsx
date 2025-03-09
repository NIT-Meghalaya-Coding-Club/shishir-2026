"use client";

import { defaultSponsorImageUrl, sponsors } from "@/data/sponsors";
import Image from "next/image";
import { Crown, Gem } from "lucide-react";

const Sponsors: React.FC = () => {
  const sponsorTypes = Object.keys(sponsors);

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundImage: 'url("/img/brickwall.webp")' }}
    >
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black-900/80" />

      <div className="relative min-h-screen py-24">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
              Our Sponsors
            </h1>
            <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
        </div>

        <div className="container mx-auto px-4">
          {sponsorTypes.map((sponsorType) => (
            <div className="mb-32" key={sponsorType}>
              {/* Sponsor Type Header */}
              <div className="relative mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-center">
                  <span className="relative">
                    {/* Spotlight effect */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-yellow-400/20 blur-3xl rounded-full animate-pulse" />

                    {/* Text with gradient */}
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
                      {sponsorType}
                    </span>
                  </span>
                </h2>
                <div className="flex justify-center gap-2 mt-4">
                  <Gem className="w-6 h-6 text-yellow-400" />
                  <Gem className="w-6 h-6 text-yellow-400" />
                  <Gem className="w-6 h-6 text-yellow-400" />
                </div>
              </div>

              {/* Sponsors Grid */}
              <ul className="flex flex-wrap justify-center gap-10">
                {sponsors[sponsorType].map((sponsor, index) => (
                 <li className="group relative w-full max-w-sm sm:w-[400px] lg:w-[450px]" key={index}>
                    {/* Spotlight effect */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 " />

                    {/* Card Container */}
                    <div className="relative">
                      {/* Animated border */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl animate-gradient-x" />

                      {/* Card Content */}
                      <div className="relative m-0.5 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 backdrop-blur-xl transform hover:scale-105 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-yellow-500/20">
                        {/* Image Container */}
                        <div className="aspect-square relative mb-6 overflow-hidden rounded-2xl bg-white/5">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-black/50 group-hover:opacity-0 transition-opacity duration-300" />
                          <Image
                            src={sponsor.imageLink ?? defaultSponsorImageUrl}
                            alt={`${sponsor.name}'s logo`}
                            fill
                            className="object-contain transition-all duration-500 group-hover:scale-110"
                          />
                        </div>

                        {/* Sponsor Name */}
                        <div className="relative">
                          <h3 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                            {sponsor.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
