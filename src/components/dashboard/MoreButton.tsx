"use client";

import { FC } from "react";

interface MoreButtonProps {
  showMoreInfo: boolean;
  setShowMoreInfo: (value: boolean) => void;
}

const MoreButton: FC<MoreButtonProps> = ({ showMoreInfo, setShowMoreInfo }) => {
  return (
    <button
      onClick={() => setShowMoreInfo(!showMoreInfo)}
      className="px-4 py-3 text-lg font-mono font-semibold text-gray-700 bg-white rounded-md shadow-md transition-all duration-200
                 hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-inner focus:outline-none"
    >
      {showMoreInfo ? "Hide Info" : "More Info"}
    </button>
  );
};

export default MoreButton;
