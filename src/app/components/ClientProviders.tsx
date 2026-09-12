"use client";

import { SessionProvider } from "next-auth/react";

//Components
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
// import { OrganizerProvider } from "@/context/OrganizerContext";
import RegistrationPrompt from "@/components/auth/RegistrationPrompt";

import { ToastContainer } from "react-toastify";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* <OrganizerProvider> */}
        <ToastContainer position="top-center" />
        <SmoothScroll />
        <NavBar />
        <RegistrationPrompt />
        {children}
        <Footer />
      {/* </OrganizerProvider> */}
    </SessionProvider>
  );
}
