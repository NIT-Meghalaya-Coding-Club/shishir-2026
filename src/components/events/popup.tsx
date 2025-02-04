import React, { useEffect } from 'react';
import Image from 'next/image';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    name: string;
    description?: string;
    image: string;
    registrationLink?: string;
    rulebook?: string;
  };
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, event }) => {
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const popupContent = document.querySelector('.popup-content');
      if (popupContent && !popupContent.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup-content backdrop-blur-md border-[0.1px] border-[#debc40] shadow-xl p-6 rounded-xl w-1/2 h-fit overflow-auto">
        <button
          onClick={onClose}
          className="absolute w-4 h-4  top-2 right-2 rounded-full text-yellow-700 hover:text-yellow-200"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-center mb-4 text-yellow-600">{event.name}</h2>
        <div className="flex justify-center items-center">
            <Image
              src={event.image}
              alt={event.name}
              width={300}
              height={200}
              className="rounded-lg mb-4"
            />
        </div>
        
        <p className="text-yellow-700 mb-4">{event.description || "No description available."}</p>
        <div className="flex gap-4">
          {event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Register Now
            </a>
          )}
          {event.rulebook && (
            <a
              href={event.rulebook}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-yellow-400 px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              View Rulebook
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;