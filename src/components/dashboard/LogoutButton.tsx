"use client";

import { signOut } from "next-auth/react";

const MoreButton = () => {
  const handleLogout = () => {
    signOut();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-3 text-lg font-mono font-semibold text-white-700 border border-white bg-none rounded-md shadow-md transition-all duration-200
                 hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-inner focus:outline-none"
    >
      Logout
    </button>
  );
};

export default MoreButton;
