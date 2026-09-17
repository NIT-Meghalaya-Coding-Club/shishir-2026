"use client";

import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { TicketCheckoutSchema } from "@/lib/validation/ticketSchema";
import ValidationDialog from "@/components/ui/ValidationDialog";

const ShishirTicketSeller: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<{
    id: number;
    name: string;
    date: string;
    artist: string;
    price: number;
    remaining: number;
    image: string;
  } | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const ticketRef = useRef<HTMLDivElement>(null);

  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Day 1 - Cultural Night",
      date: "April 3, 2025",
      artist: "Pandit Satish Vyas",
      price: 150,
      remaining: 100,
      image: "cultural",
    },
    {
      id: 2,
      name: "Day 2 - Bollywood Night",
      date: "April 4, 2025",
      artist: "Tushar Joshi",
      price: 200,
      remaining: 100,
      image: "bollywood",
    },
    {
      id: 3,
      name: "Day 3 - EDM Night",
      date: "April 5, 2025",
      artist: "DJ Alberic X DJ Infinit",
      price: 200,
      remaining: 100,
      image: "edm",
    },
    {
      id: 4,
      name: "All 3 Days Pass",
      date: "April 3-5, 2025",
      artist: "All Artists",
      price: 500,
      remaining: 100,
      image: "combo",
    },
  ]);

  useEffect(() => {
    if (selectedEvent) setAnimationPhase(1);
  }, [selectedEvent]);

  const totalAmount = selectedEvent ? selectedEvent.price * quantity : 0;
  const ticketNumber = `SHISHIR-${Math.floor(Math.random() * 90000) + 10000}`;

  const submitToGoogleSheet = async (): Promise<void> => {
    if (!selectedEvent || !process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL) return;

    try {
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketNumber,
          eventName: selectedEvent.name,
          eventDate: selectedEvent.date,
          artist: selectedEvent.artist,
          quantity,
          totalAmount,
          name,
          email,
          phone,
          paymentVerified,
        }),
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Google Sheet submission error:", error);
      }
    }
  };

  const handleProceedToPayment = () => {
    const validation = TicketCheckoutSchema.safeParse({
      name,
      email,
      phone,
      quantity,
      termsAccepted,
    });

    if (!validation.success) {
      setValidationMessage(
        validation.error.issues.map((issue) => issue.message).join("\n")
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowQR(true);
    }, 900);
  };

  const handleEventSelect = (event: (typeof events)[0]) => {
    setSelectedEvent(event);

    if (selectedEvent?.id !== event.id) {
      setQuantity(1);
      setPaymentVerified(false);
    }
  };

  const updateRemainingTickets = () => {
    if (!selectedEvent) return;

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, remaining: Math.max(0, event.remaining - quantity) }
          : event
      )
    );

    setSelectedEvent((prev) =>
      prev
        ? {
            ...prev,
            remaining: Math.max(0, prev.remaining - quantity),
          }
        : null
    );
  };

  const handleDownloadTicket = () => {
    if (!ticketRef.current) return;

    setIsLoading(true);

    html2canvas(ticketRef.current, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    }).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement("a");
      link.download = `SHISHIR_Ticket_${ticketNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsLoading(false);
    });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f6fa] font-sans text-slate-900 transition-colors duration-300 dark:bg-[#090d1a] dark:text-white">
      <ValidationDialog
        open={Boolean(validationMessage)}
        message={validationMessage}
        onClose={() => setValidationMessage("")}
      />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="ambient-orb ambient-orb-gold left-[4%] top-[8%]" />
        <div className="ambient-orb ambient-orb-indigo right-[3%] top-[28%]" />
        <div className="ambient-orb ambient-orb-purple bottom-[4%] left-[35%]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,180,45,0.08),_transparent_38%)] dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.11),_transparent_42%)]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="glass-panel relative w-full overflow-hidden rounded-[28px] border border-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:border-white/10 dark:shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
          {/* Ticket notches */}
          <div className="absolute -left-5 top-24 h-10 w-10 rounded-full bg-[#f5f6fa] dark:bg-[#090d1a]" />
          <div className="absolute -right-5 top-24 h-10 w-10 rounded-full bg-[#f5f6fa] dark:bg-[#090d1a]" />

          <div className="relative z-10 p-5 sm:p-8 lg:p-10">
            {/* Header */}
            <header className="mb-9 text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
                <span className="pulse-dot" />
                NIT Meghalaya • Annual Cultural Fest
              </div>

              <h1 className="shishir-title">SHISHIR 2025</h1>

              <div className="mx-auto mt-3 h-px w-28 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                Select your event, complete your details and reserve your pass.
              </p>
            </header>

            <div className="max-h-[calc(100vh-260px)] overflow-y-auto pr-1 scrollbar-hide">
              {isLoading ? (
                <div className="flex min-h-[460px] flex-col items-center justify-center">
                  <div className="relative mb-5 h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-2 border-amber-400/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" />
                    <div className="absolute inset-2 rounded-full border border-indigo-500/20" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {showQR && paymentVerified
                      ? "Preparing your ticket..."
                      : "Processing your request..."}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Please stay on this page.
                  </p>
                </div>
              ) : !showQR ? (
                <>
                  {/* Step 01 */}
                  <section
                    className={`transition-all duration-500 ${
                      animationPhase > 0
                        ? "scale-[0.995] opacity-95"
                        : "scale-100 opacity-100"
                    }`}
                  >
                    <SectionHeading number="01" title="Select Your Event" />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {events.map((event, index) => {
                        const isSelected = selectedEvent?.id === event.id;
                        const isSoldOut = event.remaining <= 0;

                        return (
                          <button
                            key={event.id}
                            type="button"
                            disabled={isSoldOut}
                            onClick={() => handleEventSelect(event)}
                            className={`event-card group text-left ${
                              isSelected ? "event-card-selected" : ""
                            } ${
                              isSoldOut
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                            style={{ animationDelay: `${index * 70}ms` }}
                          >
                            <div className="relative z-10 flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="mb-2 flex items-center gap-2">
                                  <span className="event-index">
                                    0{event.id}
                                  </span>
                                  {isSelected && (
                                    <span className="selected-pill">
                                      Selected
                                    </span>
                                  )}
                                </div>

                                <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                                  {event.name}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                  {event.date}
                                </p>

                                <p className="mt-3 line-clamp-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                                  Featuring {event.artist}
                                </p>
                              </div>

                              <div className="shrink-0 text-right">
                                <div className="text-xl font-bold text-amber-600 dark:text-amber-300">
                                  ₹{event.price}
                                </div>
                                <div className="mt-1 text-[11px] font-medium text-slate-400">
                                  {isSoldOut
                                    ? "Sold out"
                                    : `${event.remaining} left`}
                                </div>
                              </div>
                            </div>

                            <div className="card-glow" />
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {selectedEvent && (
                    <div className="space-y-7">
                      {/* Step 02 */}
                      <section className="section-enter" style={{ animationDelay: "80ms" }}>
                        <SectionHeading number="02" title="Ticket Quantity" />

                        <div className="surface-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              {selectedEvent.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Maximum 10 tickets per booking
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-5 sm:justify-end">
                            <div className="quantity-control">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  setQuantity(Math.max(1, quantity - 1))
                                }
                                className="quantity-btn"
                              >
                                −
                              </button>

                              <span className="w-9 text-center text-lg font-bold text-slate-900 dark:text-white">
                                {quantity}
                              </span>

                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  setQuantity(Math.min(10, quantity + 1))
                                }
                                className="quantity-btn"
                              >
                                +
                              </button>
                            </div>

                            <div className="border-l border-slate-200 pl-5 text-right dark:border-white/10">
                              <p className="text-xs text-slate-400">
                                Per ticket
                              </p>
                              <p className="mt-0.5 text-lg font-bold text-amber-600 dark:text-amber-300">
                                ₹{selectedEvent.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Step 03 */}
                      <section
                        className="section-enter"
                        style={{ animationDelay: "140ms" }}
                      >
                        <SectionHeading number="03" title="Your Details" />

                        <div className="surface-card grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
                          <FloatingInput
                            label="Full Name"
                            type="text"
                            value={name}
                            onChange={setName}
                          />
                          <FloatingInput
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={setEmail}
                          />
                          <FloatingInput
                            label="Phone Number"
                            type="tel"
                            value={phone}
                            onChange={setPhone}
                          />
                        </div>
                      </section>

                      {/* Terms */}
                      <section
                        className="section-enter"
                        style={{ animationDelay: "200ms" }}
                      >
                        <label
                          htmlFor="terms"
                          className={`terms-card ${
                            termsAccepted ? "terms-card-active" : ""
                          }`}
                        >
                          <input
                            id="terms"
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="custom-checkbox"
                          />

                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                              I agree to the Terms & Conditions
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                              Tickets are non-refundable and non-transferable.
                              Valid payment proof and college ID are required
                              for entry.
                            </span>
                          </span>
                        </label>
                      </section>

                      {/* Total + CTA */}
                      <section
                        className="section-enter"
                        style={{ animationDelay: "250ms" }}
                      >
                        <div className="checkout-card">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                              Order Summary
                            </p>
                            <div className="mt-3 space-y-2 text-sm">
                              <div className="flex justify-between gap-4 text-slate-500 dark:text-slate-400">
                                <span>
                                  Subtotal ({quantity}{" "}
                                  {quantity === 1 ? "ticket" : "tickets"})
                                </span>
                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                  ₹{selectedEvent.price * quantity}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4 text-slate-500 dark:text-slate-400">
                                <span>Booking Fee</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                  ₹0
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="my-5 border-t border-dashed border-slate-200 dark:border-white/10" />

                          <div className="flex items-end justify-between gap-5">
                            <div>
                              <p className="text-sm text-slate-400">Total</p>
                              <p className="mt-0.5 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                ₹{totalAmount}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={handleProceedToPayment}
                              className="premium-button"
                            >
                              <span>Proceed to Payment</span>
                              <svg
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </section>
                    </div>
                  )}
                </>
              ) : (
                /* Payment / Ticket */
                <section className="flex flex-col items-center section-enter">
                  <div
                    ref={ticketRef}
                    className="ticket-shell relative w-full max-w-md overflow-hidden rounded-[24px] border border-amber-300/40 bg-[#10162b] shadow-[0_30px_70px_rgba(15,23,42,0.25)]"
                  >
                    <div className="ticket-topbar relative bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-6 py-5 text-center">
                      <div className="mx-auto flex max-w-[320px] items-center justify-between">
                        <div className="logo-chip">
                          <img
                            src="/assets/NITM.png"
                            alt="College Logo"
                            width={30}
                            height={30}
                            className="h-7 w-7 object-contain"
                          />
                        </div>

                        <div>
                          <h2 className="text-2xl font-black tracking-tight text-slate-900">
                            SHISHIR 2025
                          </h2>
                          <p className="mt-0.5 text-xs font-semibold text-slate-700">
                            Annual College Fest E-Ticket
                          </p>
                        </div>

                        <div className="logo-chip">
                          <img
                            src="/assets/logo.png"
                            alt="Event Logo"
                            className="h-7 w-7 object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="ticket-body p-6 sm:p-7">
                      <div className="text-center">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
                            paymentVerified
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              paymentVerified
                                ? "bg-emerald-400"
                                : "bg-amber-400 animate-pulse"
                            }`}
                          />
                          {paymentVerified ? "Payment Verified" : "Scan to Pay"}
                        </span>

                        <p className="mt-4 text-3xl font-black text-amber-300">
                          ₹{totalAmount}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Ticket #{ticketNumber}
                        </p>
                      </div>

                      <div className="qr-frame group mt-6">
                        {paymentVerified ? (
                          <div className="flex h-full w-full items-center justify-center rounded-xl bg-white">
                            <div className="verified-ring">
                              <svg
                                className="h-14 w-14 text-emerald-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <>
                            <img
                              src="/qr.png"
                              alt="Scan to Pay via UPI"
                              className="h-full w-full rounded-xl object-contain transition-transform duration-300 group-hover:scale-[1.015]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/80 p-5 text-center opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                              <p className="text-xs leading-5 text-white">
                                Scan with any UPI app and manually enter{" "}
                                <span className="font-bold text-amber-300">
                                  ₹{totalAmount}
                                </span>
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="my-6 border-t border-dashed border-slate-700" />

                      <div className="space-y-3 text-sm">
                        <TicketRow label="Event" value={selectedEvent?.name || "N/A"} />
                        <TicketRow label="Date" value={selectedEvent?.date || "N/A"} />
                        <TicketRow label="Artist" value={selectedEvent?.artist || "N/A"} />
                        <TicketRow
                          label="Quantity"
                          value={`${quantity} ${
                            quantity === 1 ? "ticket" : "tickets"
                          }`}
                        />
                        <TicketRow label="Name" value={name || "N/A"} />
                      </div>

                      <div className="mt-6 rounded-xl border border-slate-700/80 bg-slate-950/40 p-4 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
                          Important Notice
                        </p>
                        <p className="mt-2 text-[11px] leading-5 text-slate-400">
                          This ticket is valid only with payment proof and
                          college ID. Unauthorized duplication may result in
                          denied entry.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 w-full max-w-md rounded-[20px] border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                    {!paymentVerified ? (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="step-icon">₹</div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                              Complete your payment
                            </p>
                            <p className="text-xs text-slate-400">
                              Scan the QR and verify once paid.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-500 dark:bg-slate-950/40 dark:text-slate-400">
                          <div>01. Scan using GPay, PhonePe, Paytm or any UPI app.</div>
                          <div>
                            02. Manually enter{" "}
                            <span className="font-bold text-amber-500">
                              ₹{totalAmount}
                            </span>
                            .
                          </div>
                          <div>03. Complete the payment and verify below.</div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => setShowQR(false)}
                          >
                            Back to Selection
                          </button>

                          <button
                            type="button"
                            className="success-button"
                            onClick={() => {
                              setIsLoading(true);

                              setTimeout(() => {
                                setIsLoading(false);
                                setPaymentVerified(true);
                                updateRemainingTickets();
                                submitToGoogleSheet();
                              }, 850);
                            }}
                          >
                            Verify Payment
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-center">
                          <p className="text-sm font-bold text-emerald-500 dark:text-emerald-300">
                            Payment Verified Successfully
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Download your ticket and keep it with your payment
                            proof for entry.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => setShowQR(false)}
                          >
                            Back to Selection
                          </button>

                          <button
                            type="button"
                            className="premium-button"
                            onClick={handleDownloadTicket}
                          >
                            Download Ticket
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* Footer */}
              <footer className="mt-10 border-t border-slate-200/80 pt-5 text-center dark:border-white/10">
                <p className="text-xs font-medium tracking-wide text-slate-400">
                  SHISHIR 2025 • NIT Meghalaya • Annual Cultural Fest
                </p>
              </footer>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        :global(.dark) .glass-panel {
          background: rgba(13, 18, 35, 0.82);
        }

        .ambient-orb {
          position: absolute;
          height: 220px;
          width: 220px;
          border-radius: 9999px;
          filter: blur(55px);
          opacity: 0.45;
          animation: ambientDrift 9s ease-in-out infinite;
        }

        .ambient-orb-gold {
          background: rgba(245, 158, 11, 0.18);
        }

        .ambient-orb-indigo {
          background: rgba(99, 102, 241, 0.18);
          animation-delay: -3s;
        }

        .ambient-orb-purple {
          background: rgba(168, 85, 247, 0.14);
          animation-delay: -6s;
        }

        .pulse-dot {
          height: 6px;
          width: 6px;
          border-radius: 9999px;
          background: currentColor;
          box-shadow: 0 0 0 5px rgba(245, 158, 11, 0.1);
          animation: pulseSoft 2.2s ease-in-out infinite;
        }

        .shishir-title {
          font-size: clamp(2.4rem, 7vw, 4.4rem);
          line-height: 0.95;
          font-weight: 950;
          letter-spacing: -0.045em;
          background: linear-gradient(
            120deg,
            #d79a00 0%,
            #f7cf5b 34%,
            #b87800 52%,
            #f6c547 72%,
            #c68800 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 12px 38px rgba(217, 157, 16, 0.16);
        }

        .event-card {
          position: relative;
          overflow: hidden;
          min-height: 155px;
          width: 100%;
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 20px;
          padding: 20px;
          background: rgba(248, 250, 252, 0.72);
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.045);
          transition:
            transform 300ms ease,
            box-shadow 300ms ease,
            border-color 300ms ease,
            background-color 300ms ease;
          animation: cardReveal 520ms both;
        }

        :global(.dark) .event-card {
          border-color: rgba(148, 163, 184, 0.12);
          background: rgba(255, 255, 255, 0.035);
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
        }

        .event-card:hover:not(:disabled) {
          transform: translateY(-4px);
          border-color: rgba(245, 180, 45, 0.42);
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.1);
        }

        .event-card-selected {
          border-color: rgba(245, 180, 45, 0.65);
          box-shadow: 0 18px 45px rgba(194, 135, 14, 0.12);
        }

        .card-glow {
          position: absolute;
          right: -30%;
          top: -65%;
          height: 190px;
          width: 190px;
          border-radius: 9999px;
          background: rgba(245, 180, 45, 0.12);
          filter: blur(38px);
          transition: transform 400ms ease, opacity 400ms ease;
          opacity: 0;
        }

        .event-card:hover .card-glow {
          opacity: 1;
          transform: translate(-24px, 24px);
        }

        .event-index {
          display: inline-flex;
          height: 24px;
          align-items: center;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.06);
          padding: 0 9px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #94a3b8;
        }

        :global(.dark) .event-index {
          background: rgba(255, 255, 255, 0.06);
        }

        .selected-pill {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          background: rgba(245, 180, 45, 0.12);
          padding: 4px 8px;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #c88a00;
        }

        .surface-card {
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 20px;
          background: rgba(248, 250, 252, 0.68);
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.04);
        }

        :global(.dark) .surface-card {
          border-color: rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.035);
        }

        .section-enter {
          animation: sectionReveal 560ms both;
        }

        .quantity-control {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.72);
          padding: 5px;
        }

        :global(.dark) .quantity-control {
          background: rgba(255, 255, 255, 0.045);
        }

        .quantity-btn {
          display: inline-flex;
          height: 38px;
          width: 38px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.05);
          font-size: 20px;
          line-height: 1;
          color: #475569;
          transition:
            transform 180ms ease,
            background 180ms ease;
        }

        .quantity-btn:hover {
          transform: translateY(-1px);
          background: rgba(245, 180, 45, 0.15);
        }

        :global(.dark) .quantity-btn {
          background: rgba(255, 255, 255, 0.06);
          color: #cbd5e1;
        }

        .floating-field {
          position: relative;
        }

        .floating-input {
          width: 100%;
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.8);
          padding: 18px 14px 10px;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          transition:
            border-color 200ms ease,
            box-shadow 200ms ease,
            transform 200ms ease;
        }

        .floating-input:focus {
          border-color: rgba(245, 180, 45, 0.75);
          box-shadow: 0 0 0 4px rgba(245, 180, 45, 0.08);
          transform: translateY(-1px);
        }

        :global(.dark) .floating-input {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          color: white;
        }

        .floating-label {
          position: absolute;
          left: 14px;
          top: 7px;
          pointer-events: none;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
        }

        .terms-card {
          display: flex;
          cursor: pointer;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 18px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.6);
          transition:
            border-color 200ms ease,
            background 200ms ease,
            transform 200ms ease;
        }

        .terms-card:hover {
          transform: translateY(-1px);
          border-color: rgba(245, 180, 45, 0.3);
        }

        .terms-card-active {
          border-color: rgba(245, 180, 45, 0.45);
          background: rgba(245, 180, 45, 0.055);
        }

        :global(.dark) .terms-card {
          border-color: rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.03);
        }

        .custom-checkbox {
          margin-top: 2px;
          height: 17px;
          width: 17px;
          accent-color: #e3a813;
        }

        .checkout-card {
          border: 1px solid rgba(245, 180, 45, 0.22);
          border-radius: 22px;
          background:
            linear-gradient(
              135deg,
              rgba(245, 180, 45, 0.085),
              rgba(99, 102, 241, 0.055)
            ),
            rgba(255, 255, 255, 0.74);
          padding: 20px;
          box-shadow: 0 16px 46px rgba(15, 23, 42, 0.06);
        }

        :global(.dark) .checkout-card {
          background:
            linear-gradient(
              135deg,
              rgba(245, 180, 45, 0.085),
              rgba(99, 102, 241, 0.055)
            ),
            rgba(255, 255, 255, 0.03);
        }

        .premium-button,
        .success-button,
        .secondary-button {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 13px;
          padding: 0 18px;
          font-size: 13px;
          font-weight: 800;
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            filter 220ms ease;
        }

        .premium-button {
          background: linear-gradient(135deg, #f8d15d, #e8ae25);
          color: #171b2f;
          box-shadow: 0 12px 28px rgba(226, 167, 34, 0.18);
        }

        .premium-button:hover {
          transform: translateY(-2px);
          filter: brightness(1.03);
          box-shadow: 0 17px 34px rgba(226, 167, 34, 0.24);
        }

        .success-button {
          background: linear-gradient(135deg, #2fbf7f, #20a968);
          color: white;
          box-shadow: 0 12px 28px rgba(32, 169, 104, 0.16);
        }

        .success-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 17px 34px rgba(32, 169, 104, 0.23);
        }

        .secondary-button {
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(255, 255, 255, 0.7);
          color: #475569;
        }

        .secondary-button:hover {
          transform: translateY(-2px);
          background: rgba(248, 250, 252, 0.95);
        }

        :global(.dark) .secondary-button {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.045);
          color: #cbd5e1;
        }

        .logo-chip {
          display: flex;
          height: 42px;
          width: 42px;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
        }

        .ticket-body {
          background:
            radial-gradient(
              circle at 12% 8%,
              rgba(245, 180, 45, 0.085),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 50%,
              rgba(99, 102, 241, 0.09),
              transparent 30%
            ),
            #10162b;
        }

        .qr-frame {
          position: relative;
          margin-left: auto;
          margin-right: auto;
          height: 224px;
          width: 224px;
          border-radius: 16px;
          padding: 8px;
          background: white;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.7),
            0 18px 45px rgba(0, 0, 0, 0.18);
        }

        .verified-ring {
          display: flex;
          height: 86px;
          width: 86px;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 10px solid rgba(16, 185, 129, 0.1);
          background: rgba(16, 185, 129, 0.06);
          animation: verifyPop 500ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .step-icon {
          display: flex;
          height: 38px;
          width: 38px;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(245, 180, 45, 0.14);
          color: #d69b12;
          font-size: 14px;
          font-weight: 900;
        }

        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes cardReveal {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes sectionReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ambientDrift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(10px, -14px, 0) scale(1.05);
          }
        }

        @keyframes pulseSoft {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }

        @keyframes verifyPop {
          from {
            opacity: 0;
            transform: scale(0.75);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 640px) {
          .checkout-card {
            padding: 17px;
          }

          .premium-button,
          .success-button,
          .secondary-button {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ambient-orb,
          .pulse-dot,
          .event-card,
          .section-enter,
          .verified-ring {
            animation: none !important;
          }

          .event-card,
          .premium-button,
          .success-button,
          .secondary-button,
          .quantity-btn,
          .terms-card,
          .floating-input {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-900 px-2 text-[10px] font-black tracking-[0.12em] text-amber-300 dark:bg-white dark:text-slate-900">
        {number}
      </span>
      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
        {title}
      </h2>
    </div>
  );
}

function FloatingInput({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="floating-field">
      <label className="floating-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="floating-input"
        required
      />
    </div>
  );
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-[65%] text-right font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

export default ShishirTicketSeller;
