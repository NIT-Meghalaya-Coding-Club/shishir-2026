"use client"

import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"

export default function EditButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/register")}
      className="fixed bottom-8 right-8 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
      aria-label="Edit Profile"
    >
      <Pencil className="w-6 h-6" />
    </button>
  )
}