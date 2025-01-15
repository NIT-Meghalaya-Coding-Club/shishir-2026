"use client"

import { defaultSponsorImageUrl, sponsors } from "@/data/sponsors";
import Image from "next/image";

const Sponsors:React.FC = () => {
    const sponsorTypes = Object.keys(sponsors);
    return (
        <div className="h-full pt-24 grid justify-items-center overflow-x-hidden">
            {sponsorTypes.map((sponsorType) => (
                <div 
                    className=" max-w-screen px-4 flex flex-col justify-center gap-4 text-center pt-4" 
                    key={sponsorType}
                >
                    <h1>{sponsorType}</h1>
                    <ul className="flex flex-wrap justify-center gap-4 max-w-[700px] p-4">
                        {sponsors[sponsorType].map((sponsor, index) => (
                            <li
                                className="flex flex-col gap-3" 
                                key={index}
                            >
                                <Image 
                                    src={sponsor.imageLink ?? defaultSponsorImageUrl} 
                                    alt={`${sponsor.name}'s logo`} 
                                    width={100}
                                    height={100}
                                    className="w-48 h-auto object-cover rounded-xl" 
                                />
                                <div className="text-center flex flex-col gap-2">
                                    <h1>{sponsor.name}</h1>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default Sponsors;