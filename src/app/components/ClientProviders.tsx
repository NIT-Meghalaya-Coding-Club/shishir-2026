"use client";

import { SessionProvider } from "next-auth/react";

//Components
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import RegistrationPrompt from "@/components/auth/RegistrationPrompt";

import { ToastContainer } from "react-toastify";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastContainer position="top-center" />
      <NavBar />
      <RegistrationPrompt />
      {children}
      <Footer />
    </SessionProvider>
  );
}
