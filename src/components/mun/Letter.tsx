'use client';

import React from "react";
import Blossom from "@/components/Blossom";
import Title from "./Title";

/* Wooden end-cap used on both sides of the scroll */
function RodCap({ position }: { position: "top" | "bottom" }) {
  const knob = (
    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-b from-[#3D5A80] via-[#293241] to-[#1b2230] border border-[#98C1D9]/60 shadow-[0_3px_8px_rgba(41,50,65,0.45)] flex items-center justify-center">
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#EE6C4D]" />
    </div>
  );

  const band = (
    <div className="w-4 sm:w-5 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-[#EE6C4D] via-[#F6B7B0] to-[#EE6C4D]" />
  );

  if (position === "top") {
    return (
      <div className="relative flex flex-col items-center -top-2">
        {band}
        <div className="mt-0.5">{knob}</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center -bottom-2">
      {knob}
      <div className="mt-0.5">{band}</div>

      <div className="mt-0.5 flex flex-col items-center">
        <div className="w-px h-2 sm:h-3 bg-[#EE6C4D]" />
        <div className="w-1.5 sm:w-2 h-4 sm:h-6 rounded-b-full bg-gradient-to-b from-[#EE6C4D] via-[#F4A9A0] to-[#98C1D9] shadow-[0_2px_5px_rgba(41,50,65,0.3)]" />
      </div>
    </div>
  );
}

/* Scroll roller */
function Roller() {
  return (
    <>
      <RodCap position="top" />

      <div className="w-full flex-1 rounded-[3px] bg-gradient-to-r from-[#9db6c4] via-[#FFFDF8] via-[#F1F8F9] to-[#8aa6b8] shadow-[inset_0_0_0_1px_rgba(61,90,128,0.25),0_0_10px_rgba(41,50,65,0.25)]" />

      <RodCap position="bottom" />
    </>
  );
}

const SACLetter: React.FC = () => {
  /* Same subtle paper grain used by the Shishir scroll */
  const paperGrain =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.24  0 0 0 0 0.35  0 0 0 0 0.5  0 0 0 0.09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

  return (
      <div className="mx-auto w-full max-w-5xl px-1 sm:px-2 lg:px-4">
        <div className="relative py-8 sm:py-10 md:py-12">
          
          <Title text="Letter From SAC President" />

          {/* Soft background glow */}
          <div className="absolute inset-4 sm:inset-8 rounded-full bg-[radial-gradient(circle,rgba(152,193,217,0.20)_0%,rgba(238,108,77,0.08)_45%,transparent_72%)] dark:bg-[radial-gradient(circle,rgba(152,193,217,0.12)_0%,rgba(238,108,77,0.07)_45%,transparent_72%)] blur-3xl pointer-events-none" />

          {/* Scroll */}
          <div className="relative z-10 flex">

            {/* Left vertical roller */}
            <div className="relative w-4 sm:w-5 md:w-6 shrink-0 flex flex-col items-center justify-between -my-4 sm:-my-5 md:-my-6 z-30">
              <Roller />
            </div>

            {/* Paper */}
            <div className="relative flex-1 min-w-0 overflow-hidden rounded-[3px] bg-[#E0FBFC] dark:bg-[#293241] border-y-[5px] sm:border-y-[6px] border-[#3D5A80] dark:border-[#98C1D9] shadow-[0_24px_60px_-18px_rgba(61,90,128,0.5),0_0_0_1px_rgba(152,193,217,0.5)]">

              {/* Paper background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] via-[#F3FCFC] to-[#DDF1F5] dark:from-[#3b4d6b] dark:via-[#33435e] dark:to-[#2c3a52]" />

              {/* Paper grain */}
              <div
                className="absolute inset-0 opacity-60 dark:opacity-30 mix-blend-multiply pointer-events-none"
                style={{ backgroundImage: paperGrain, contain: "strict" }}
              />

              {/* Peach mounting lines */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#EE6C4D] z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EE6C4D] z-10" />

              {/* Blossom decoration */}
              <svg
                viewBox="0 0 140 120"
                className="hidden sm:block absolute top-1 right-1 w-28 md:w-36 opacity-45 pointer-events-none z-0"
                aria-hidden="true"
              >
                <path
                  d="M138 8 C112 16 94 38 66 52 S28 82 6 104 M94 38 C98 52 90 62 80 70 M66 52 C60 38 50 32 40 30"
                  fill="none"
                  stroke="#293241"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {[
                  [112, 17, "#F4A9A0"],
                  [94, 38, "#EE6C4D"],
                  [80, 70, "#F9C9C4"],
                  [66, 52, "#F4A9A0"],
                  [40, 30, "#F9C9C4"],
                  [28, 82, "#EE6C4D"],
                ].map(([cx, cy, fill], i) => (
                  <g key={i}>
                    <circle
                      cx={cx as number}
                      cy={cy as number}
                      r="7"
                      fill={fill as string}
                      opacity="0.9"
                    />
                    <circle
                      cx={cx as number}
                      cy={cy as number}
                      r="2"
                      fill="#FFF4E0"
                    />
                  </g>
                ))}
              </svg>

              {/* Writing area */}
              <div className="relative m-2 sm:m-4 md:m-6 p-4 sm:p-6 md:p-8 lg:p-10 border border-[#3D5A80]/25 dark:border-[#98C1D9]/30 rounded-[2px] z-10">

                {/* Header */}
                <div className="mb-6 sm:mb-8 border-b border-[#3D5A80]/20 dark:border-[#98C1D9]/20 pb-4 sm:pb-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                      <div className="flex items-center gap-2">
                        <Blossom className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#EE6C4D] animate-spin [animation-duration:3s]" />

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#EE6C4D]">
                          NIT Meghalaya
                        </p>
                      </div>

                      <p className="mt-1 text-sm text-[#293241]/60 dark:text-[#E0FBFC]/60">
                        Student Activity Center
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.12em] text-[#3D5A80] dark:text-[#98C1D9]">
                        Youth Parliament 2026
                      </p>

                    </div>
                  </div>
                </div>

                {/* Greeting */}
                <div className="mb-6 sm:mb-8">
                  <p className="font-serif text-sm sm:text-base md:text-lg leading-7 text-[#293241] dark:text-[#E0FBFC]">
                    Dear Participants, Esteemed Guests, and Esteemed Members of the NIT
                    Meghalaya Community,
                  </p>
                </div>

                {/* Letter content */}
                <div className="space-y-5 sm:space-y-6 text-justify text-sm leading-7 sm:text-base md:text-[1.02rem] md:leading-8 text-[#293241]/80 dark:text-[#E0FBFC]/80 font-serif">

                  <p className="first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-semibold first-letter:text-[#EE6C4D]">
                    Welcome to the National Institute of Technology
                    Meghalaya Youth Parliament 2026. It is my profound
                    honor to address such a vibrant assembly of young diplomats, eager
                    to debate, negotiate, and craft resolutions that reflect the
                    complexities of our global landscape.
                  </p>

                  <p>
                    Since our inaugural session in 2023, NITMMUN has grown from a
                    nascent conference into a cornerstone event that exemplifies the
                    analytical rigor and diplomatic finesse expected of future leaders.
                    Our second conference in 2024 built upon this foundation, expanding
                    its scope and depth, engaging delegates in more intense and diverse
                    deliberations that tested their resolve and honed their skills.
                  </p>

                  <p>
                    This year, we proudly host Youth Parliament alongside{" "}
                    <strong className="font-semibold text-[#EE6C4D]">
                      Shishir
                    </strong>
                    , our cherished cultural festival. This confluence of cultural and
                    intellectual festivities is designed to enhance your experience,
                    providing a unique blend of artistic celebration and academic
                    excellence. This synergy not only enriches our campus culture but
                    also offers participants a holistic view of the vibrancy that NIT
                    Meghalaya has to offer.
                  </p>

                  <p>
                    Reflecting on our past conferences, it is heartening to see the
                    remarkable impact these experiences have had on our participants.
                    Delegates who once navigated the complexities of international
                    policies and negotiations in our committees have gone on to excel
                    in various professional fields, embodying the spirit of global
                    citizenship and cooperation.
                  </p>

                  <p>
                    Our 2023 edition set the precedent with its innovative agendas and
                    inclusive debate forums. The following year, in 2024, we delved
                    deeper into pressing global issues, fostering a culture of critical
                    thinking and solution-oriented discussions that resonated well
                    beyond our campus.
                  </p>

                  <p>
                    As we step into our Youth Parliament 2026, amidst the echoes of
                    Shishir&apos;s cultural anthems, I invite you all to embrace the
                    challenge, celebrate diversity, and contribute to the dialogues
                    that stimulate change. Let this platform be a testimony to your
                    potential to influence the world, advocating for peace, equity, and
                    sustainability.
                  </p>

                  <p>
                    Thank you for joining us at Youth Parliament 2026. Engage, deliberate, and
                    enjoy your journey at this confluence of culture and diplomacy.
                  </p>
                </div>

                {/* Signature */}
                <div className="relative mt-8 sm:mt-10 pt-6 border-t border-[#3D5A80]/20 dark:border-[#98C1D9]/20">

                  <div className="flex items-center gap-2">
                    <Blossom className="w-4 h-4 text-[#EE6C4D] animate-spin [animation-duration:3s]" />

                    <p className="text-sm font-semibold tracking-wide text-[#3D5A80] dark:text-[#98C1D9]">
                      Warm regards,
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-lg sm:text-xl font-bold text-[#EE6C4D]">
                      Dr. Rajat Subhra Das
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#293241]/65 dark:text-[#E0FBFC]/65">
                      President, Student Activity Center
                      <br />
                      National Institute of Technology Meghalaya
                    </p>
                  </div>

                  {/* Hanko-style seal */}
                  <div
                    className="absolute bottom-0 right-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-[#EE6C4D] text-[#FFF4E0] flex items-center justify-center shadow-[0_3px_8px_rgba(238,108,77,0.45)] mix-blend-multiply dark:mix-blend-normal"
                    style={{ transform: "rotate(-6deg)" }}
                    aria-hidden="true"
                  >
                    <div className="absolute inset-[4px] rounded-[4px] border border-[#FFF4E0]/70" />

                    <span className="text-[0.55rem] sm:text-xs font-extrabold tracking-tighter">
                      NITM
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right vertical roller */}
            <div className="relative w-4 sm:w-5 md:w-6 shrink-0 flex flex-col items-center justify-between -my-4 sm:-my-5 md:-my-6 z-30">
              <Roller />
            </div>
          </div>
        </div>
      </div>
  );
};

export default SACLetter;