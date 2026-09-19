import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shishir 2025",
  description: "Annual cultural festival of NIT Meghalaya - Shishir 2025",
  openGraph: {
    title: "Shishir 2025 - NIT Meghalaya",
    description: "Join us for the biggest cultural festival of NIT Meghalaya, Shishir 2025!",
    url: "https://shishir.nitm.ac.in", 
    siteName: "Shishir 2025",
    images: [
      {
        url: "https://shishir.nitm.ac.in/shishir.png", 
        width: 500,
        height: 500,
        alt: "Shishir 2025 Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shishir 2025 - NIT Meghalaya",
    description: "Join us for the biggest cultural festival of NIT Meghalaya, Shishir 2025!",
    images: ["https://shishir.nitm.ac.in/shishir.png"], 
  },
};


// import { SessionProvider } from "next-auth/react";

import { ClientProviders } from "@/app/components/ClientProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics/>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
