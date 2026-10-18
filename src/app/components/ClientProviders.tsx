"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";

//Components
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import PageLoader from "@/components/ui/page-loader";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
// import { OrganizerProvider } from "@/context/OrganizerContext";
import RegistrationPrompt from "@/components/auth/RegistrationPrompt";

import { ToastContainer } from "react-toastify";

import { ThemeProvider } from "@/context/ThemeContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {/* <OrganizerProvider> */}
        <ToastContainer position="top-center" />
        <SmoothScroll />
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
        <NavBar />
        <RegistrationPrompt />
        {children}
        <Footer />
        {/* </OrganizerProvider> */}
      </ThemeProvider>
    </SessionProvider>
  );
}
