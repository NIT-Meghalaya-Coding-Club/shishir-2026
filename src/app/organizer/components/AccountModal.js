import React from 'react'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Link from 'next/link';

const AccountModal = ({ pathname, handleClose}) => {
  return (
    <div className='fixed bg-[#555555] shadow-md left-0 top-0 w-screen px-10 py-10'>
        <Link href='/organizer/profile' onClick={handleClose} className={`${(pathname==='events')?"text-[#00FF38]":"text-white"} font-light text-xl mt-3`}>Profile <ArrowRightIcon /></Link>
    </div>
  )
}

export default AccountModal