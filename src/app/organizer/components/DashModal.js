import React from 'react'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Link from 'next/link';


const DashModal = ({ pathname, handleClose }) => {
  return (
    <div className='fixed flex flex-col bg-[#555555] shadow-md left-0 top-0 w-screen px-10 py-10'>
        <Link href='/organizer' onClick={handleClose} className={`font-light text-xl mt-3 ${(pathname==='organizer')?"text-[#00FF38]":"text-white"}`}>Dashboard <ArrowRightIcon /></Link>
        <Link href='/organizer/events' onClick={handleClose} className={`font-light text-xl mt-3 ${(pathname==='events')?"text-[#00FF38]":"text-white"}`}>Events <ArrowRightIcon /></Link>
    </div>
  )
}

export default DashModal