"use client"
import { defaultImageUrl, Teams } from "@/data/Teams";
import { useRef } from "react";
import Image from 'next/image';

export default function Contact() {

    const teamRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

    const teamNames = Object.keys(Teams);

    function scrollToTeam(team: string) {
        teamRefs.current[team]?.scrollIntoView({behavior: "smooth", block: "center"});
    }

    return (
      <div className="flex flex-col sm:flex-row h-fit sm:h-screen w-screen pt-20">
        <div 
            className="pb-20 sm:pb-0 sm:sticky sm:top-0 basis-1/3 grid place-content-center"
        >
            <h1 className="text-4xl">Contact Us</h1>
            <div className=" flex flex-col gap-3 mt-5">
                {teamNames.map((team) => (
                    <div 
                        className="cursor-pointer"
                        key={team}
                        onClick={() => scrollToTeam(team)}
                    >
                        <li className="list-disc">{team}</li>
                    </div>
                ))}
            </div>
        </div>
        <div className=" basis-2/3 h-full grid gap-10 justify-center sm:overflow-y-scroll">
            {teamNames.map((team) => (
                <div 
                    className="flex flex-col items-center gap-4" 
                    key={team}
                    ref={(el) => {teamRefs.current[team] = el}}
                >
                    <h1>{team}</h1>
                    <ul className="flex flex-wrap justify-center">
                        {Teams[team].map((member, index) => (
                            <div
                                className="flex flex-col items-center gap-3" 
                                key={index}
                            >
                                <Image 
                                    src={member.imageLink ?? defaultImageUrl} 
                                    alt={`${member.name}'s photo`} 
                                    width={100}
                                    height={100}
                                    className="w-64 h-auto object-cover rounded-xl" 
                                />
                                <div className="text-center flex flex-col gap-2">
                                    <li>{member.name}</li>
                                    <div className="flex gap-4 justify-center">   
                                        <Image 
                                            src="/whatsApp.svg"
                                            alt="whatsappLogo" 
                                            width={40} 
                                            height={40}
                                            onClick={() => window.open(member.whatsappLink ?? "")} 
                                        />
                                        <Image 
                                            src="/linkedin.svg"
                                            alt="whatsappLogo" 
                                            width={40} 
                                            height={40}
                                            onClick={() => window.open(member.whatsappLink ?? "")} 
                                        />
                                        <Image 
                                            src="/instagram.svg"
                                            alt="whatsappLogo" 
                                            width={40} 
                                            height={40}
                                            onClick={() => window.open(member.whatsappLink ?? "")} 
                                        />
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
  