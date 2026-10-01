import MUNCountdownTimer from "@/components/mun/MunCountdown";
import AboutUs from "@/components/mun/AboutUs";
import MUN_FAQ from "@/components/mun/FAQ";
import Intro from "@/components/mun/Intro";
import LegacySection from "@/components/mun/Legacy";
import SACLetter from "@/components/mun/Letter";
import Logo_mun from "@/components/mun/Logo";
import TeamSection from "@/components/mun/TeamSection";
import StickyRegisterButton from "@/components/mun/StickyRegisterButton";

import { Crown } from "lucide-react";
import "./mun_style.css";

const Mun: React.FC = () => {
  return (
    <div className="mun-page relative min-h-screen overflow-hidden bg-[#E0FBFC] dark:bg-[#172B46]">

      {/* Background elements */}
      <div className="mun-background" aria-hidden="true">
        <span className="mun-orb mun-orb-blue-1" />
        <span className="mun-orb mun-orb-blue-2" />
        <span className="mun-orb mun-orb-peach-1" />
        <span className="mun-orb mun-orb-peach-2" />

        {/* Floating particles */}
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

      {/* Main page content */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 sm:px-6 lg:px-8">

        <section className="relative flex w-full flex-col items-center pt-28">
          <div className="mun-hero-glow" />

          {/* Title */}
          <div className="mun-title-row">
            <Crown className="mun-crown mun-crown-left" />

            <h1 className="mun-title text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              YOUTH PARLIAMENT 2026
            </h1>

            <Crown className="mun-crown mun-crown-right" />
          </div>

          {/* Title divider */}
          <div className="mun-divider">
            <span className="mun-divider-line" />
            <span className="mun-divider-dot" />
            <span className="mun-divider-main" />
            <span className="mun-divider-dot" />
            <span className="mun-divider-line" />
          </div>
        </section>

        {/* Sections */}
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