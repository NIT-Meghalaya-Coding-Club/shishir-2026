"use client";

import { defaultSponsorImageUrl, sponsors } from "@/data/sponsors";
import Image from "next/image";

const Sponsors: React.FC = () => {
  const sponsorTypes = Object.keys(sponsors);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundImage: 'url("/img/brickwall.png")' }}
    >
      <div className="bg-black/40 min-h-screen py-24 ">
        <div className="container mx-auto px-4">
          {sponsorTypes.map((sponsorType) => (
            <div className="mb-20" key={sponsorType}>
              <h2
                className="text-5xl md:text-6xl font-bold mb-16 text-center text-white 
                                           bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400"
              >
                {sponsorType}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                {sponsors[sponsorType].map((sponsor, index) => (
                  <li
                    className="bg-white/10 backdrop-blur-md rounded-3xl p-8 transform 
                                                 hover:scale-105 transition-transform duration-300 
                                                 w-full max-w-sm border border-white/20 shadow-lg 
                                                 hover:shadow-xl"
                    key={index}
                  >
                    <div
                      className="aspect-square relative mb-6 overflow-hidden rounded-2xl 
                                                        border-2 border-white/20"
                    >
                      <Image
                        src={sponsor.imageLink ?? defaultSponsorImageUrl}
                        alt={`${sponsor.name}'s logo`}
                        fill
                        className="object-contain hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white text-center 
                                                       bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400"
                    >
                      {sponsor.name}
                    </h3>
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
