"use client";

import { SessionProvider } from "next-auth/react";

//Context
import { OrganizerProvider } from "@/context/OrganizerContext";

//Components
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

import { ToastContainer } from "react-toastify";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <OrganizerProvider>
        <ToastContainer position="top-center" />
        <SmoothScroll />
        <NavBar />
        {children}
        <Footer />
      </OrganizerProvider>
    </SessionProvider>
  );
}
