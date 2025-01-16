'use client'
import Image from 'next/image';

const GoogleSignInButton = () => {
  return (
    <button className="flex items-center justify-center bg-white border border-gray-300 rounded-md shadow-sm px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <Image
        src="/img/google-icon.png" 
        alt="Google"
        width={20}
        height={20}
        className="mr-2"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;