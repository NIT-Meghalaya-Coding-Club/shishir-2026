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
    <main className="min-h-screen">
      <ShishirTicketSeller />
    </main>
  );
}