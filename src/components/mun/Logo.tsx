import React from 'react'
import Image from 'next/image'

function Logo_mun() {
  return (
    <div>
        <Image
        src={"/img/mun_logo.png"} 
        alt="MUN"
        width={250}
        height={250}
        className="rounded-sm mt-8"
      />
    </div>
  )
}

export default Logo_mun