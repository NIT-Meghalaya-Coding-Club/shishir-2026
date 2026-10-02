import React from 'react'
import ShishirTicketSeller from "../../components/tickets/ticket";
import ComingSoon from '@/components/ComingSoon';

import PageHeading from "@/components/PageHeading";

export default function TicketsPage() {
  if (process.env.NEXT_PUBLIC_LAUNCH) {
    return (
      <ComingSoon />
    )
  }
  return (
    <main className="min-h-screen">
      <PageHeading title="Tickets" />

      <ShishirTicketSeller />
    </main>
  );
}