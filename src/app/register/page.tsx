"use client";

import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Components
import GoogleSignInButton from "@/components/competition/googleSignInButton";

// Assets
import logo from "../../../public/assets/logo.png";
import Loading from "../components/Loading";

function Register() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleClick = async () => {
    signIn("google", {
      callbackUrl: "/fill-details"
    });
  };
  
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#E0FBFC] dark:bg-[#293241] transition-colors duration-300">
      {/* Background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#98C1D9] blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#EE6C4D] blur-[100px] opacity-30"></div>
      
      {(status === "authenticated" || status === "loading") && <Loading />}
      
      <div className="absolute z-20 min-h-[60vh] w-[90%] sm:w-[70%] max-w-2xl rounded-3xl text-center bg-[#E0FBFC]/80 dark:bg-[#293241]/80 border border-[#98C1D9]/50 dark:border-[#3D5A80]/50 backdrop-blur-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 sm:p-12 shadow-2xl flex flex-col justify-center items-center">
        <Image
          src={logo}
          alt="Shishir 2026 Logo"
          height={0}
          width={0}
          sizes="100svw"
          className="h-28 w-auto mx-auto drop-shadow-lg"
          unoptimized
        />
        <div className="text-4xl font-zentry font-bold pt-6">
          <h1 className="font-general font-medium text-2xl text-[#3D5A80] dark:text-[#98C1D9] mb-2">Welcome to</h1>
          <h1 className="text-5xl font-extrabold text-[#EE6C4D] drop-shadow-sm tracking-wide">
            Shishir 2026!
          </h1>
        </div>
        <p className="text-lg mt-8 text-[#293241] dark:text-[#E0FBFC] mb-10 max-w-md mx-auto font-medium">
          Log in to join the celebration and immerse yourself in the spirit of the festival.
        </p>
        <div className="mx-auto w-fit transition-transform hover:scale-105 active:scale-95" onClick={handleClick}>
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}

export default Register;
