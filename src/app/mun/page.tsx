import MUNCountdownTimer from "@/components/mun/MunCountdown";
import AboutUs from "@/components/mun/AboutUs";
import MUN_FAQ from "@/components/mun/FAQ";
import Intro from "@/components/mun/Intro";
import LegacySection from "@/components/mun/Legacy";
import SACLetter from "@/components/mun/Letter";
import Logo_mun from "@/components/mun/Logo";
import TeamSection from "@/components/mun/TeamSection";
import StickyRegisterButton from "@/components/mun/StickyRegisterButton";

import { Crown, Sparkles } from "lucide-react";

const Mun: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#172B46]">

      <div className="mun-background">

        <span className="mun-orb mun-orb-blue-1" />
        <span className="mun-orb mun-orb-blue-2" />

        <span className="mun-orb mun-orb-peach-1" />
        <span className="mun-orb mun-orb-peach-2" />

        <span className="mun-particle mun-particle-1" />
        <span className="mun-particle mun-particle-2" />
        <span className="mun-particle mun-particle-3" />
        <span className="mun-particle mun-particle-4" />

        <span className="mun-particle mun-particle-5" />
        <span className="mun-particle mun-particle-6" />
        <span className="mun-particle mun-particle-7" />
        <span className="mun-particle mun-particle-8" />

        <span className="mun-particle mun-particle-9" />
        <span className="mun-particle mun-particle-10" />
        <span className="mun-particle mun-particle-11" />
        <span className="mun-particle mun-particle-12" />

        <span className="mun-particle mun-particle-13" />
        <span className="mun-particle mun-particle-14" />
        <span className="mun-particle mun-particle-15" />
        <span className="mun-particle mun-particle-16" />

      </div>

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 sm:px-6 lg:px-8">
        <section className="relative flex w-full flex-col items-center pt-28">

          <div className="mun-hero-glow" />

          {/* Left sparkle */}
          <Sparkles
            className="
              mun-hero-sparkle
              absolute
              left-[10%]
              top-20
              h-4
              w-4
            "
          />

          {/* Right sparkle */}
          <Sparkles
            className="
              mun-hero-sparkle
              absolute
              right-[11%]
              top-28
              h-5
              w-5
            "
            style={{
              animationDelay: "1.5s",
            }}
          />

          {/* Small center decorative sparkle */}
          <Sparkles
            className="
              mun-hero-sparkle
              absolute
              left-[25%]
              top-36
              h-3
              w-3
            "
            style={{
              animationDelay: "2.5s",
            }}
          />


          {/* MAIN TITLE */}
          <div className="relative flex items-center gap-3 sm:gap-4">

            {/* Left crown */}
            <Crown
              className="
                h-7 w-7
                text-[#EE6C4D]
                sm:h-9 sm:w-9
                md:h-11 md:w-11
              "
            />


            {/* Title */}
            <h1
              className="
                text-center
                text-4xl
                font-bold
                tracking-tight
                text-[#EE6C4D]
                sm:text-5xl
                md:text-6xl
              "
            >
              NITM MUN 3.0
            </h1>


            {/* Right crown */}
            <Crown
              className="
                h-7 w-7
                text-[#EE6C4D]
                sm:h-9 sm:w-9
                md:h-11 md:w-11
              "
            />

          </div>

          <div className="mt-3 flex items-center gap-3">

            <div
              className="
                h-px
                w-8
                bg-[#3D5A80]
                sm:w-14
              "
            />

            <div
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#3D5A80]
              "
            />

            <div
              className="
                h-1
                w-24
                rounded-full
                bg-[#3D5A80]
                sm:w-36
                md:w-48
              "
            />

            <div
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#3D5A80]
              "
            />

            <div
              className="
                h-px
                w-8
                bg-[#3D5A80]
                sm:w-14
              "
            />

          </div>

          <p
            className="
              mt-5
              max-w-xl
              text-center
              text-sm
              leading-6
              text-[#98C1D9]
              sm:text-base
            "
          >
            {/* Diplomacy • Debate • Leadership • Global Perspectives */}
          </p>

        </section>

        <Logo_mun />
        <Intro />
        <MUNCountdownTimer />
        <SACLetter />
        <AboutUs />
        <LegacySection />
        <MUN_FAQ />
        <TeamSection />
        <StickyRegisterButton />

      </div>
    </div>
  );
};

export default Mun;