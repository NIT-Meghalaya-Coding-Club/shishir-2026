'use client'
import Image from 'next/image'
import React from 'react'

function Rbutton() {
  return (
    <div>
        <a href="/register">
        <Image
            src="/img/ml_stone.png"
            alt="Arrow Down"
            width={100}
            height={100} 
          />
        </a>
    </div>
  )
}

export default Rbutton