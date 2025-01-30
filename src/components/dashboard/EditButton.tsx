"use client"

import { useState } from "react"

export default function EditButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = async () => {
    setIsLoading(true)
    // Editing page
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    alert("Edit functionality would be implemented here")
  }

  return (
    <button
      onClick={handleEdit}
      disabled={isLoading}
      className="w-full sm:w-auto px-6 py-3 bg-teal-50 text-teal-950 font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
    >
      {isLoading ? "Processing..." : "Edit Information"}
    </button>
  )
}

