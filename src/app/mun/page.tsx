
// import DiagonalImageScroll from "@/components/mun/DiagonalImageScroll";
import CountdownTimer from "@/components/homepage/countdownTimer";
import AboutUs from "@/components/mun/AboutUs";
import MUN_FAQ from "@/components/mun/FAQ";
import Intro from "@/components/mun/Intro";
import LegacySection from "@/components/mun/Legacy";
import SACLetter from "@/components/mun/Letter";
import Logo_mun from "@/components/mun/Logo";
import TeamSection from "@/components/mun/TeamSection";
import { Crown } from "lucide-react";


const Mun: React.FC = () => {
  return (
    <div style = {{backgroundImage: "url('/background2.jpg')", backgroundPosition: "center"}}>
    <div className="flex flex-col  items-center min-h-screen w-full">
      <div className="relative flex items-center gap-4 mt-28">
        <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
        <h1 className="text-6xl hover:scale-105 transition-all duration-300 cursor-pointer font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
          NITM MUN
        </h1>
        <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
      </div>
      <div className="group pb-5">
        <div className="h-1 w-52 group-hover:w-72 cursor-pointer transition-all duration-300 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mt-2" />
      </div>
      <Logo_mun />
      <Intro />
      <CountdownTimer />
      <SACLetter />
      <AboutUs />
      <LegacySection />
      <MUN_FAQ />
      <TeamSection />
    </div>
    </div>
  );
};

export default Mun;
