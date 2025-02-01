"use client"

import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"

export default function EditButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/register")}
      className="fixed bottom-8 right-8 bg-[#ffffff] text-[#1b1313] p-4 rounded-full shadow-lg hover:bg-[#1b1313] hover:text-white hover:scale-125 transition-all"
      aria-label="Edit Profile"
    >
      <Pencil className="w-6 h-6" />
    </button>
  )
}