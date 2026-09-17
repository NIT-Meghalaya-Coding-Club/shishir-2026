"use client";
import { defaultImageUrl, Teams } from "@/data/Teams";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaPhone, FaEnvelope, FaLinkedin } from "react-icons/fa6";
import { Crown, Sparkles } from "lucide-react";
import { RiMenu4Line } from "@remixicon/react";
/*=============== Imported a separate CSS file just for this page ===============*/
import './team_style.css' ;


type TeamMember = {
  name: string;
  contactNo: string;
  email: string;
  position: string;
  imageLink?: string;
};

export default function Contact() {
  const [teams, setTeams] = useState<Record<string, TeamMember[]>>(Teams);
  const teamRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const teamNames = Object.keys(teams);

  useEffect(() => {
    fetch("/api/teams")
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) return;

        const databaseTeams = (data.teams || []).filter(
          (team: { name: string }) => team.name !== "Student Activity Center (SAC)"
        );

        setTeams({
          ...Teams,
          ...Object.fromEntries(
            databaseTeams.map((team: { name: string; members: TeamMember[] }) => [
              team.name,
              team.members,
            ])
          ),
        });
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
      className="flex flex-col sm:flex-row min-h-screen w-full relative bg-[#f3efe8] dark:bg-[#080605]"
      style={{
      backgroundImage: `
          repeating-linear-gradient(
            30deg,
            transparent 0 25px,
            rgba(245, 181, 27, 0.08) 34px 35px
          ),
          repeating-linear-gradient(
            90deg,
            transparent 0 25px,
            rgba(245, 181, 27, 0.08) 34px 35px
          ),
          repeating-linear-gradient(
            150deg,
            transparent 0 25px,
            rgba(245, 181, 27, 0.08) 34px 35px
          )
        `
      }}
    >
      {/* Background overlay added */}
      <div className="absolute inset-0 bg-white/20 dark:bg-black/20 pointer-events-none" />
      {/* Gradient overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-slate-100/90 to-white/95 dark:from-gray-900/80 dark:to-black/80 transition-colors duration-300" /> */}


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

          {/* =============== Kinda unnecessary (removed) =============== */}
          {/* Updated Navigation Links */}
          {/* <div className="flex flex-col w-full max-w-xs overflow-hidden relative h-96">
            <div className="absolute inset-0 overflow-y-hidden hover:overflow-y-auto hide-scrollbar">
              <div className="animate-scroll hover:animation-pause">
                <div className="flex flex-col gap-8"> */}
                  {/* {" "} */}
                  {/* Increased gap between groups */}
                  {/* {[...Array(3)].map((_, i) => (
                    <div key={`group-${i}`} className="space-y-4">
                      {" "} */}
                      {/* Added space between buttons */}
                      {/* {teamNames.map((team) => (
                        <button
                          key={`${team}-${i}`}
                          onClick={() => scrollToTeam(team)}
                          className="group relative px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 w-full hover:transform hover:-rotate-1"
                        > */}
                          {/* Updated button styling */}
                          {/* <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg opacity-30 group-hover:opacity-100 transition-opacity blur-sm group-hover:blur-none" />
                          <div className="relative bg-white/80 dark:bg-black/50 backdrop-blur-lg rounded-lg px-6 py-3 border border-yellow-500/20 dark:border-yellow-500/10 group-hover:border-transparent transition-all duration-300 shadow-sm dark:shadow-none">
                            <h1 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 dark:from-yellow-400 dark:via-yellow-500 dark:to-yellow-600 group-hover:from-yellow-500 group-hover:to-amber-600"> */}
                              {/* {team} */}
                            {/* </h1>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))} */}
                {/* </div>
              </div>
            </div> */}
          {/* </div> */}
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
            className="card"
          >
            {/* Background + Blur */}
            <div className="card__bg-wrapper">
              <div className="card__blur" />
            </div>

            {/* Team Heading */}
            <div className="relative z-10 text-center mb-12">
              <h2 className="team-heading">
                {team}
              </h2>
            </div>

            {/* Team Members */}
            <div className="card__container container">
              {teams[team].map((member, index) => {
                const cardTheme = [
                  "card-yellow",
                  "card-green",
                  "card-pink",
                ][index % 3];

                return (
                  <article
                    key={`${team}-${index}`}
                    className={`card__article ${cardTheme}`}
                  >
                    {/* Profile Image */}
                    <div className="relative w-full">
                      <Image
                        src={member.imageLink || defaultImageUrl}
                        alt={`${member.name}'s photo`}
                        width={400}
                        height={500}
                        className="card__img"
                      />
                    </div>

                    {/* Image Shadow */}
                    <div className="card__shadow" />

                    {/* Member Basic Information */}
                    <div className="card__data">
                      <h2 className="card__name">{member.name}</h2>
                      <span className="card__profession">
                        {member.position}
                      </span>
                    </div>

                    {/* Expand Button */}
                    <div className="card__clip">
                      <RiMenu4Line />
                    </div>

                    {/* Expanded Information */}
                    <div className="info">
                      <div className="info__data">
                        <h2 className="info__name">
                          {member.name}
                        </h2>

                        <p className="info__description">
                          {member.position}
                        </p>
                        
                        <div className="info__divider" />

                        <div className="info__contact">
                          <a
                            href={`tel:${member.contactNo}`}
                            className="info__contact-link"
                          >
                            <FaPhone className="info__contact-icon" />
                            <span>{member.contactNo}</span>
                          </a>

                          <a
                            href={`mailto:${member.email}`}
                            className="info__contact-link"
                          >
                            <FaEnvelope className="info__contact-icon" />
                            <span>{member.email}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
