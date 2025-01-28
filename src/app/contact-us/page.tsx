"use client";
import { defaultImageUrl, Teams } from "@/data/Teams";
import { useRef } from "react";
import Image from "next/image";
import { FaPhone, FaEnvelope, FaLinkedin } from "react-icons/fa6";



export default function Contact() {
  const teamRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const teamNames = Object.keys(Teams);

  function scrollToTeam(team: string) {
    const teamElement = teamRefs.current[team];
    if (teamElement) {
      teamElement.scrollIntoView({
        behavior: "smooth",
        block: "start", // Changed to 'start' for better alignment
      });
    }
  }

  return (
    <div className="flex flex-col sm:flex-row h-fit sm:h-screen w-screen pt-20"
    style={{ backgroundImage: 'url("/img/brickwall.png")' }}>
      <div className="pb-20 sm:pb-0 sm:sticky sm:top-0 basis-1/3 grid place-content-center">
        <h1 className="text-4xl">Contact Us</h1>
        <div className="flex flex-col gap-3 mt-5">
          {teamNames.map((team) => (
            <div
              className="cursor-pointer hover:text-blue-500 transition-colors"
              key={team}
              onClick={() => scrollToTeam(team)}
            >
              <li className="list-disc">{team}</li>
            </div>
          ))}
        </div>
      </div>
      <div className="basis-2/3 h-full grid gap-10 justify-center sm:overflow-y-auto">
        {teamNames.map((team) => (
          <div
            className="flex flex-col items-center gap-4 py-10" // Added padding for better spacing
            key={team}
            ref={(el) => {
              teamRefs.current[team] = el;
            }}
          >
            <h1 className="text-2xl font-bold">{team}</h1>
            <ul className="flex flex-wrap justify-center gap-8">
              {Teams[team].map((member, index) => (
                <div
                  className="relative w-[300px] h-[400px] p-8"
                  key={index}
                  style={{
                    backgroundImage: 'url("/img/frame.png")',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div className="flex flex-col items-center gap-3 h-full justify-center">
                    <Image
                      src={member.imageLink ?? defaultImageUrl}
                      alt={`${member.name}'s photo`}
                      width={120}
                      height={120}
                      className="rounded-full object-cover"
                    />
                    <div className="text-center flex flex-col gap-2">
                      <h2 className="text-xl font-semibold">{member.name}</h2>
                      <div className="flex gap-4 justify-center">
                        <a
                          href={`tel:${member.contactNo}`}
                          className="cursor-pointer hover:text-blue-500 transition-colors"
                        >
                          <FaPhone size={20} />
                        </a>
                        <a
                          href={`mailto:${member.email}`}
                          className="cursor-pointer hover:text-blue-500 transition-colors"
                        >
                          <FaEnvelope size={20} />
                        </a>
                        {member.linkedinLink && (
                          <a
                            href={member.linkedinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer hover:text-blue-700 transition-colors"
                          >
                            <FaLinkedin size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}