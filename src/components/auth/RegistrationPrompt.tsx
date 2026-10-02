"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';

export default function RegistrationPrompt() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email || !session) {
      setShowModal(false);
      return;
    }

    let cancelled = false;

    const checkRegistration = async () => {
      try {
        const response = await fetch(
          `/api/user/get-info/${encodeURIComponent(session.user?.email as string)}`,
          { cache: "no-store" }
        );
        if (!response.ok || cancelled) return;

        const data = await response.json();
        if (!cancelled) setShowModal(!data.user?.registered);
      } catch (error) {
        console.error("Failed to check registration status:", error);
      }
    };

    checkRegistration();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email, status]);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  if (!showModal) return null;

 return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-[#293241]/90 bg-gradient-to-b from-[#98C1D9] to-[#98C1D9]/80 p-5 text-center shadow-2xl shadow-[#000000]/50 sm:p-8">
        
        <div className="w-40 h-28 mx-auto overflow-hidden rounded-xl flex justify-center">
          <Image
            src="https://y.getyarn.io/6e674edc-1597-4447-a8ab-d8f1d7f8b5ed_text.gif"
            alt="Complete action"
            width={200}
            height={128}
            unoptimized
            className="h-28 w-[200px] max-w-none object-cover"
          />
        </div>

        {/* Main Heading */}
        <h2 className="mb-2 mt-2 text-xl font-bold text-red-800 sm:text-3xl">
          Complete Your Registration
        </h2>
        
        {/* Divider */}
        <div className="mx-auto mb-4 h-1 w-32 rounded-full bg-gradient-to-r from-red-800 to-red-400" />
        
        {/* Paragraph Text */}
        <p className="mt-2 text-sm text-[#171c26] sm:text-base opacity-90">
          You have not completed your registration. Please proceed to set up your profile.
        </p>
        
        {/* Button Container */}
        <div className="mt-6 flex flex-col gap-3 sm:mt-8">
          <button
            type="button"
            className="rounded-lg bg-[#E0FBFC] px-6 py-2 font-bold text-sm text-red-800 transition-all duration-300 hover:scale-105 hover:bg-red-800 hover:text-[#E0FBFC] hover:shadow-lg hover:shadow-[#293241]/30 sm:py-3 sm:text-base"
            onClick={() => {
              setShowModal(false);
              router.push("/dashboard/profile-details");
            }}
          >
            Proceed to Registration
          </button>
        </div>
        
      </div>
    </div>
  );
}