"use client"

import React, { useState } from 'react'

import Link from 'next/link';

//MUI Icons
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

//Components
import DashModal from './DashModal';
import AccountModal from './AccountModal';

//Router
import { usePathname } from 'next/navigation';

const OrganizerPhoneNav = () => {

    const [dashModalOpen, setDashModalOpen] = useState(false)
    const [accountModalOpen, setAccountModalOpen] = useState(false)



    const pathname = usePathname().split('/').pop();

    const handleDashOpen = () => {
        if (dashModalOpen) {
            setDashModalOpen(false)
            setAccountModalOpen(false)
        }
        else {
            setDashModalOpen(true)
            setAccountModalOpen(false)
        }
    }

    const handleAccountOpen = () => {
        if (accountModalOpen) {
            setAccountModalOpen(false)
            setDashModalOpen(false)
        }
        else {
            setAccountModalOpen(true)
            setDashModalOpen(false)
        }
    }

    const handleClose = () => {
        setAccountModalOpen(false)
        setDashModalOpen(false)
    }


    return (
        <div className='bg-[#555555]  w-screen h-[7svh] rounded-t-lg px-16 flex flex-row items-center justify-between md:hidden fixed bottom-0 z-10'>
            <div className={`${(pathname === 'organizer' || pathname === 'events') ? "text-[#00FF38]" : ""}`}>
                {dashModalOpen && <DashModal pathname={pathname} handleClose={handleClose}/>}
                <SpaceDashboardIcon onClick={handleDashOpen} sx={{ width: "30px", height: "auto" }} />
            </div>
            <Link href='/organizer/scan' className='bg-white text-black shadow-xl absolute right-[calc(50%-40px)] bottom-[10px] w-[80px] h-[80px] rounded-full flex justify-center items-center'>
                <QrCodeScannerIcon sx={{ width: "50px", height: "auto" }} />
            </Link>
            <div className=''>
                {accountModalOpen && <AccountModal pathname={pathname} handleClose={handleClose}/>}
                <AccountCircleIcon onClick={handleAccountOpen} sx={{ width: "30px", height: "auto" }} />
            </div>
        </div>
    )
}

export default OrganizerPhoneNav;