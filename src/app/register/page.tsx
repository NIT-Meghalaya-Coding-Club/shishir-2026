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
    <div className="wrapper">
      {(status === "authenticated" || status === "loading") && <Loading />}
      <div className="container absolute z-20 min-h-[60vh] w-[70%] rounded-2xl text-center bg-[#ffffff1a] backdrop-blur-[30px] top-[23%] left-[17%] p-[3%] px-5 py-10">
        <Image
          src={logo}
          alt="Shishir 2025 Logo"
          height="0"
          width="0"
          sizes="100svw"
          className="h-[7rem] w-auto mx-auto"
        />
        <div className="text-4xl font-zentry font-bold text-white pt-4">
          <h1 className="font-general font-light text-2xl">Welcome to</h1>
          <h1 className="text-5xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Shishir 2025!
          </h1>
        </div>
        <div className="text-lg mt-10 text-white mb-8 pt-4">
          Log in to join the celebration and immerse yourself in the spirit of
          the festival.
        </div>
        <div className="mx-auto w-fit" onClick={handleClick}>
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}

export default Register;
