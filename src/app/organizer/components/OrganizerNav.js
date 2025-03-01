import Image from 'next/image';
import React from 'react'

//Assets




const OrganizerNav = ({ handleSetLogoutModal, pathname }) => {



  return (
    <div className='mb-10 md:mb-0'>
        <div className='bg-white w-screen h-[65px] px-10 py-2 flex flex-row-reverse justify-between items-center'>
            STREETJAM ADMIN
            {(pathname!=='/organizer/login') && <div onClick={handleSetLogoutModal} className='md:ml-12 bg-white w-fit px-4 py-1 rounded-full text-black h-fit font-coolvetica'>
              <p>LOGOUT</p>
            </div>}
        </div>
        <hr className='md:hidden mx-5 border-b-[1px] border-[#555555]'/>
    </div>
  )
}

export default OrganizerNav;