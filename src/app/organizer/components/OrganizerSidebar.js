import React from 'react'

import Link from 'next/link';


//MUI Icons
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import EventIcon from '@mui/icons-material/Event';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

//Router
import { usePathname } from 'next/navigation';


const OrganizerSidebar = () => {

    const pathname = usePathname().split('/').pop();
    

    return (
        <div className='bg-[#555555] md:w-[20vw] py-20 pl-10 md:block hidden'>
            <div className=''>
                <h2 className='text-xl font-medium'>Home</h2>
                <Link href='/organizer/' className={`rounded-md rounded-r-none ${pathname==='organizer'?"bg-[#D9D9D9] text-black": ""} hover:bg-[#D9D9D9] hover:text-black flex flex-row items-center gap-6 py-4 pl-4`}>
                    <SpaceDashboardIcon />
                    <p className='text-sm'>Dashboard</p>
                </Link>
                <Link href='/organizer/events' className={`rounded-md rounded-r-none ${pathname==='events'?"bg-[#D9D9D9] text-black": ""} hover:bg-[#D9D9D9] hover:text-black flex flex-row items-center gap-6 py-4 pl-4`}>
                    <EventIcon />
                    <p className='text-sm'>All Homestays</p>
                </Link>
            </div>
            <div className='mt-10'>
                <h2 className='text-xl font-medium'>Manage</h2>
                <Link href='/organizer/scan' className={`rounded-md rounded-r-none ${pathname==='scan'?"bg-[#D9D9D9] text-black": ""} hover:bg-[#D9D9D9] hover:text-black flex flex-row items-center gap-6 py-4 pl-4`}>
                    <QrCodeScannerIcon />
                    <p className='text-sm'>Ticket Scanner</p>
                </Link>
            </div>
            <div className='mt-10'>
                <h2 className='text-xl font-medium'>Settings</h2>
                <Link href='/organizer/profile' className={`rounded-md rounded-r-none ${pathname==='profile'?"bg-[#D9D9D9] text-black": ""} hover:bg-[#D9D9D9] hover:text-black flex flex-row items-center gap-6 py-4 pl-4`}>
                    <AccountCircleIcon />
                    <p className='text-sm'>Profile</p>
                </Link>
            </div>
        </div>
    )
}

export default OrganizerSidebar