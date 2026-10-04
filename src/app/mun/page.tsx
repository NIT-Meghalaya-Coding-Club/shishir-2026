import MUNCountdownTimer from "@/components/mun/MunCountdown";
import AboutUs from "@/components/mun/AboutUs";
import MUN_FAQ from "@/components/mun/FAQ";
import Intro from "@/components/mun/Intro";
import LegacySection from "@/components/mun/Legacy";
import SACLetter from "@/components/mun/Letter";
import Logo_mun from "@/components/mun/Logo";
import TeamSection from "@/components/mun/TeamSection";
import StickyRegisterButton from "@/components/mun/StickyRegisterButton";
import Blossom from '@/components/Blossom';

import "./mun_style.css";

const Mun: React.FC = () => {
  return (
    <div 
      className="mun-page relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url('/img/pattern-floral.png')`,
        backgroundSize: '700px',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#E0FBFC]/80 dark:bg-[#293241]/80 pointer-events-none transition-colors duration-300 fixed" />

      {/* Main page content */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 sm:px-6 lg:px-8">

        <section className="relative flex w-full flex-col items-center pt-28">
          <div className="mun-hero-glow" />

          {/* Title */}
          <div className="relative flex w-full justify-center items-center">
            <Blossom className="w-10 h-10 sm:w-10 sm:h-10 text-[#98C1D9]/90 animate-spin [animation-duration:3s]" />


            <h1 className="mun-title text-center pl-5 pr-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              YOUTH PARLIAMENT 2026
            </h1>

            <Blossom className="w-10 h-10 sm:w-10 sm:h-10 text-[#98C1D9]/90 animate-spin [animation-duration:3s]" />
          </div>

          {/* Title divider */}
          <div className="mun-divider">
            <span className="mun-divider-main" />
            <Blossom className="h-4 w-4 text-[#EE6C4D]/90" />
            <span className="mun-divider-main" />
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