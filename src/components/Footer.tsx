'use client'
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#030716] text-gray-700 pt-4 pb-4 ">
      <div className="container mx-auto px-4 pt-8 border-dashed border-t-2 border-teal-700">
        {/* Social Media Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#c84c47] mb-4">FOLLOW US ON</h2>
          <div className="flex gap-6">
            <Link href="#" className="text-[#f2da73] hover:opacity-80">
              Facebook
            </Link>
            <Link href="#" className="text-[#f2da73] hover:opacity-80">
              Linkedin
            </Link>
            <Link href="#" className="text-[#f2da73] hover:opacity-80">
              Instagram
            </Link>
            <Link href="#" className="text-[#f2da73] hover:opacity-80">
              Whatsapp
            </Link>
          </div>
        </div>

        {/* Quick Links and Legals Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#c84c47] mb-4">QUICK LINKS</h2>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#f2da73] hover:underline">Home</Link></li>
              <li><Link href="#" className="text-[#f2da73] hover:underline">Events</Link></li>
              <li><Link href="#" className="text-[#f2da73] hover:underline">Sponsors</Link></li>
              <li><Link href="#" className="text-[#f2da73] hover:underline">Teams</Link></li>
              <li><Link href="#" className="text-[#f2da73] hover:underline">NITM-MUN</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#c84c47] mb-4">LEGALS</h2>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#f2da73] hover:underline">Terms and Conditions</Link></li>
              <li><Link href="#" className="text-[#f2da73] hover:underline">Copyright</Link></li>
              <li><Link href="#" className="text-[#f2da73] hover:underline">Disclaimer</Link></li>
              <li><Link href="#" className="text-[#f2da73] hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact and Support */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#c84c47] mb-4">CONTACT AND SUPPORT</h2>
          <p className="text-[#446885]">
            National Institute of Technology Meghalaya, Bijni Complex, Laitumkhrah Shillong-793003, Meghalaya, India
            <br />
            Phone: 0364-2501294 | Fax: 0364-2501113
          </p>
        </div>

        {/* Find Us At */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#c84c47] mb-4">FIND US AT</h2>
          <p className="text-[#446885]">
            National Institute of Technology Meghalaya Bijni Complex, Laitumkhrah, Shillong 793003
          </p>
        </div>

        {/* End Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#c84c47] mb-4">YOU&apos;VE REACHED THE END ~</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#"
              className="inline-flex items-center px-6 py-2 border-2 border-[#c84c47] text-[#c84c47] rounded-md hover:bg-[#c84c47] hover:text-white transition-colors"
            >
              Leave a message for the Devs
            </Link>
            <Link
              href="#"
              className="inline-flex items-center px-6 py-2 border-2 border-[#c84c47] text-[#c84c47] rounded-md hover:bg-[#c84c47] hover:text-white transition-colors"
            >
              Donate
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center px-6 py-2 border-2 border-[#c84c47] text-[#c84c47] rounded-md hover:bg-[#c84c47] hover:text-white transition-colors ml-auto"
            >
              Go Back To TOP
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="text-sm text-[#446885]">
          <p>Designed and developed by <Link href="#" className="text-[#c84c47] italic hover:underline">NITM Web Dev Creatives</Link></p>
        </div>

        {/* Copyright */}
        <div className="relative overflow-hidden text-white bg-[#446885] mt-8 py-2 -mx-4">
            <div className="animate-marquee whitespace-nowrap">
                ©copyright 2024 nitm/shishir | All Rights Reserved
            </div>
        </div>
      </div>
    </footer>
  )
}
