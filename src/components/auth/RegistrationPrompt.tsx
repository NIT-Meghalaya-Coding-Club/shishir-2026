"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-indigo-500/30 bg-gradient-to-b from-[#1a1c6b] to-[#0c0e33] p-5 text-center shadow-2xl sm:p-8">
        <h2 className="mb-2 text-xl font-bold text-amber-400 sm:text-3xl">
          Complete Your Registration
        </h2>
        <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-purple-500" />
        <p className="mt-2 text-sm text-indigo-100 sm:text-base">
          You have not completed your registration. Please proceed to set up your profile.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:mt-8">
          <button
            type="button"
            className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-2 font-medium text-sm text-blue-900 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 sm:py-3 sm:text-base"
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