"use client"

import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"

export default function EditButton({ desktop = false }: { desktop?: boolean }) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/dashboard/profile-details")}
      className={desktop
        ? "flex items-center gap-2 rounded-full bg-[#EE6C4D] px-3 py-2 text-white shadow-md transition-all hover:scale-105 hover:bg-[#d95b3f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6C4D] focus-visible:ring-offset-2"
        : "fixed bottom-8 right-8 z-30 flex items-center gap-2 rounded-full bg-[#EE6C4D] px-4 py-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-[#d95b3f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6C4D] focus-visible:ring-offset-2"}
      aria-label="Edit Profile"
      title="Edit Profile"
    >
      <Pencil className="w-6 h-6" />
      <span className="hidden sm:inline">Edit Profile</span>
    </button>
  )
}
