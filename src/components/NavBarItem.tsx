"use client"

import { useRouter } from "next/navigation";

interface Props {
    to: string;
    text: string;
}

const NavBarItem:React.FC<Props> = ({to, text}) => {
    const router = useRouter();

    const navigateTo = () => {
        router.push(to);
    }

    return (
        <li 
            className="cursor-pointer px-8 py-3 text-sm font-bold transition-transform hover:scale-105"
            onClick={navigateTo}
        >
            <div className="absolute inset-0 bg-[#ffc278] transform skew-x-[-12deg] rounded-md" />
            <span className="relative text-[#2b1b4d]">{text}</span>
        </li>
    );
}

export default NavBarItem;