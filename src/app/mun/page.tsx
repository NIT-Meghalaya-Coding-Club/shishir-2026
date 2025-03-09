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

const Mun: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/img/brickwall.webp')",
        backgroundPosition: "center",
      }}
      className="relative min-h-screen"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black-900/80 pointer-events-none" />
      <div className="flex flex-col items-center min-h-screen w-full relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center gap-4 mt-28">
          <Crown className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-400 animate-pulse" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl hover:scale-105 transition-all duration-300 cursor-pointer font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
            NITM MUN 3.0
          </h1>
          <Crown className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-400 animate-pulse" />
        </div>
        <div className="group pb-5">
          <div className="h-1 w-32 sm:w-40 md:w-52 group-hover:w-48 sm:group-hover:w-60 md:group-hover:w-72 cursor-pointer transition-all duration-300 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mt-2" />
        </div>

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
