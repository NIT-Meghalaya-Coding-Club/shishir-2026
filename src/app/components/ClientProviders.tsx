"use client";

import { SessionProvider } from "next-auth/react";

//Components
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NavBar />
      {children}
      <Footer />
    </SessionProvider>
  );
}
