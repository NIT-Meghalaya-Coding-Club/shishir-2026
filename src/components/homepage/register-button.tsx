'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


function Rbutton() {
  return (
    <div>
        <Link href="/register">
        <Image
            src="/img/ml_stone.png"
            alt="Arrow Down"
            width={100}
            height={100} 
          />
        </Link>
    </div>
  )
}

export default Rbutton