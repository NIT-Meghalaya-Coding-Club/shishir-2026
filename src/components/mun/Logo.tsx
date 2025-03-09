import React from 'react'
import Image from 'next/image'

function Logo_mun() {
  return (
    <div className="flex justify-center items-center">
      <Image
        src={"/img/mun_logo.webp"} 
        alt="MUN"
        width={250}
        height={250}
        className="rounded-sm mt-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
      />
    </div>
  )
}

export default Logo_mun