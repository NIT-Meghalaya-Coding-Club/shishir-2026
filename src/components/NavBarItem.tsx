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
            className="p-4 cursor-pointer"
            onClick={navigateTo}
        >
            {text}
        </li>
    );
}

export default NavBarItem;