"use client";
import { defaultImageUrl } from "@/data/Teams";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaPhone, FaEnvelope, FaLinkedin } from "react-icons/fa6";
import { Crown, Sparkles } from "lucide-react";

type TeamMember = {
  name: string;
  contactNo: string;
  email: string;
  position: string;
  imageLink?: string;
};

export default function Contact() {
  const [teams, setTeams] = useState<Record<string, TeamMember[]>>({});
  const teamRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const teamNames = Object.keys(teams);

  useEffect(() => {
    fetch("/api/teams")
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) return;

        setTeams(
          Object.fromEntries(
            (data.teams || []).map((team: { name: string; members: TeamMember[] }) => [
              team.name,
              team.members,
            ])
          )
        );
      })
      .catch((error) => console.error("Failed to load teams:", error));
  }, []);

  function scrollToTeam(team: string) {
    const teamElement = teamRefs.current[team];
    if (teamElement) {
      const navbarOffset = 40;

      const elementPosition = teamElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  return (
    <div
      className="flex flex-col sm:flex-row min-h-screen w-full relative"
      style={{ backgroundImage: 'url("/img/brickwall.webp")' }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black-900/80" />

      {/* Sidebar Navigation */}
      <div className="relative z-10 pb-20 sm:pb-0 sm:sticky sm:top-0 sm:h-screen basis-1/3 p-8 ">
        <div className="h-full flex flex-col items-center justify-center">
          {/* Updated Header */}
          <div className="text-center mb-12 pt-16">
            <div className="flex items-center gap-4 mb-6">
              <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
                Team
              </h1>
              <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full" />
          </div>

          {/* Updated Navigation Links */}
          <div className="flex flex-col w-full max-w-xs overflow-hidden relative h-96">
            <div className="absolute inset-0 overflow-y-hidden hover:overflow-y-auto hide-scrollbar">
              <div className="animate-scroll hover:animation-pause">
                <div className="flex flex-col gap-8">
                  {" "}
                  {/* Increased gap between groups */}
                  {[...Array(3)].map((_, i) => (
                    <div key={`group-${i}`} className="space-y-4">
                      {" "}
                      {/* Added space between buttons */}
                      {teamNames.map((team) => (
                        <button
                          key={`${team}-${i}`}
                          onClick={() => scrollToTeam(team)}
                          className="group relative px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 w-full hover:transform hover:-rotate-1"
                        >
                          {/* Updated button styling */}
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg opacity-30 group-hover:opacity-100 transition-opacity blur-sm group-hover:blur-none" />
                          <div className="relative bg-black/50 backdrop-blur-lg rounded-lg px-6 py-3 border border-yellow-500/10 group-hover:border-transparent transition-all duration-300">
                            <h1 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 group-hover:from-yellow-200 group-hover:to-yellow-400">
                              {team}
                            </h1>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 basis-2/3 sm:overflow-y-auto px-4 sm:px-8 pt-20">
        {teamNames.map((team) => (
          <div
            key={team}
            ref={(el) => {
              teamRefs.current[team] = el;
            }}
            className="py-16"
          >
            {/* Team Header */}
            <div className="text-center mb-16 relative">
              {/* Spotlight effect */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-yellow-400/20 blur-3xl rounded-full" />

              <div className="relative">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                    {team}
                  </h2>
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
              </div>
            </div>

            {/* Team Members Grid */}
            <div className="flex flex-wrap justify-center gap-8">
              {teams[team].map((member, index) => (
                <div key={index} className="group relative w-[300px]">
                  {/* Member Card */}
                  <div className="relative">
                    {/* Card gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl animate-gradient-x" />

                    {/* Card Content */}
                    <div className="relative m-0.5 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 backdrop-blur-xl transform hover:scale-95 transition-all duration-500">
                      {/* Spotlight effect */}
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="flex flex-col items-center gap-6">
                        {/* Profile Image */}
                        <div className="relative w-32 h-32">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full animate-gradient-x" />
                          <div className="absolute inset-0.5 bg-gray-900 rounded-full overflow-hidden">
                            <Image
                              src={member.imageLink ?? defaultImageUrl}
                              alt={`${member.name}'s photo`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        </div>

                        {/* Member Info */}
                        <div className="text-center">
                          <h3 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 ">
                            {member.name}
                          </h3>
                          <span className="text-sm text-transparent bg-clip-text text-white ">
                            {member.position}
                          </span>

                          {/* Contact Links */}
                          <div className="flex gap-6 justify-center pt-3">
                            <a
                              href={`tel:${member.contactNo}`}
                              className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 relative z-20"
                            >
                              <FaPhone size={24} />
                            </a>
                            <a
                              href={`mailto:${member.email}`}
                              className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 relative z-20"
                            >
                              <FaEnvelope size={24} />
                            </a>
                            {member.linkedinLink && (
                              <a
                                href={member.linkedinLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 relative z-20"
                              >
                                <FaLinkedin size={24} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
