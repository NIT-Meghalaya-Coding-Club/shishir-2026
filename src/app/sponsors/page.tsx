"use client";

import { defaultSponsorImageUrl, sponsors } from "@/data/sponsors";
import Image from "next/image";
import { Gem } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";
import Head from "next/head";

import PageHeading from "@/components/PageHeading";
import Blossom from "@/components/Blossom";

const Sponsors: React.FC = () => {
  const sponsorTypes = Object.keys(sponsors);

  if (process.env.NEXT_PUBLIC_LAUNCH) {
    return (
      <ComingSoon />
    )
  }

  return (
    <>
      <Head>
        <link rel="preload" href="/img/pattern-floral.png" as="image" />
      </Head>
      <div
        className="relative flex flex-col items-center w-full h-auto min-h-screen overflow-x-hidden"
        style={{
          backgroundImage: `url('/img/pattern-floral.png')`,
          backgroundSize: '700px',
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-[#E0FBFC]/80 pointer-events-none transition-colors duration-300" />

        <div className="relative min-h-screen py-24 w-full">
        {/* Header Section */}
        <PageHeading title="Past Sponsors" />

        <div className="container mx-auto px-4">
          {sponsorTypes.map((sponsorType) => (
            <div className="mb-32" key={sponsorType}>
              {/* Category heading */}
              <div className="mx-4 mb-4 flex justify-center sm:mx-8">
                <div className="flex max-w-full items-center gap-2 rounded-full border border-[#98C1D9]/70 bg-[#E0FBFC]/80 px-4 py-2 shadow-sm backdrop-blur-md sm:gap-4 sm:px-8 sm:py-3">
                  <Blossom className="h-6 w-6 shrink-0 animate-spin text-[#EE6C4D] [animation-duration:3s] sm:h-9 sm:w-9" />
                  <h2 className="truncate text-lg font-extrabold uppercase tracking-widest text-[#293241] sm:text-3xl md:text-4xl">
                    {sponsorType.replace(/_/g, " ")}
                  </h2>
                  <Blossom className="h-6 w-6 shrink-0 animate-spin text-[#EE6C4D] [animation-duration:3s] sm:h-9 sm:w-9" />
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
                      <div className="absolute inset-0 bg-gradient-to-r rounded-3xl animate-gradient-x" />

                      {/* Card Content */}
                      <div className="relative m-0.5 bg-gradient-to-br from-white to-slate-100 rounded-3xl p-8 backdrop-blur-xl transform hover:scale-105 transition-all duration-500 shadow-md group-hover:shadow-2xl">
                        {/* Image Container */}
                        <div className="aspect-square relative mb-6 overflow-hidden rounded-2xl bg-slate-100 p-4">
                          <Image
                            src={sponsor.imageLink ?? defaultSponsorImageUrl}
                            alt={`${sponsor.name}'s logo`}
                            fill
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 400px, 450px"
                            className="object-contain transition-all duration-500 group-hover:scale-110"
                          />
                        </div>

                        {/* Sponsor Name */}
                        <div className="relative">
                          <h3 className="text-2xl md:text-3xl font-bold text-center bg-clip-text bg-gradient-to-r text-[#293241]">
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
    </>
  );
};

export default Sponsors;
