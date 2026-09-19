import React from 'react'
import ShishirTicketSeller from "../../components/tickets/ticket";
import ComingSoon from '@/components/ComingSoon';


export default function TicketsPage() {
  if (process.env.NEXT_PUBLIC_LAUNCH) {
    return (
      <ComingSoon />
    )
  }
  return (
    <main className="h-screen w-full">
      <ShishirTicketSeller />
    </main>
  );
}