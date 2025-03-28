'use client'
import Image from 'next/image'
import Link from 'next/link'

function TicketButton() {
  return (
    <Link 
      href="/ticket" 
      className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 
      animate-[shake_0.5s_ease-in-out_infinite] hover:animate-none"
    >
      <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-xl flex items-center justify-center">
        <Image
          src="/img/ticket.webp"
          alt="Get Ticket"
          width={700}
          height={700}
          className="p-2 hover:rotate-6 transition-transform duration-300 brightness-110 hover:brightness-125"
        />
      </div>
    </Link>
  )
}

export default TicketButton