"use client";
import React, { useState, useEffect, useRef } from "react";
// import QRCode from 'qrcode.react';
import html2canvas from "html2canvas";

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
  const ticketRef = useRef<HTMLDivElement>(null);

  const submitToGoogleSheet = async (): Promise<void> => {
    if (!selectedEvent || !process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL) {
      console.error('Missing required data or Google Script URL');
      return;
    }
  
    const submissionData = {
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
      timestamp: new Date().toISOString()
    };
  
    console.log('Attempting to submit:', submissionData);
  
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Submission successful:', data);
    } catch (error) {
      console.error('Submission failed:', error);
      
    }
  };
  // Event data for 3 days + combo
  const events = [
    {
      id: 1,
      name: "Day 1 - Cultural Night",
      date: "April 3, 2025",
      artist: "Cultural Performances",
      price: 150,
      remaining: 200,
      image: "cultural",
    },
    {
      id: 2,
      name: "Day 2 - Bollywood Night",
      date: "April 4, 2025",
      artist: "Tushar Joshi",
      price: 200,
      remaining: 150,
      image: "bollywood",
    },
    {
      id: 3,
      name: "Day 3 - EDM Night",
      date: "April 5, 2025",
      artist: "Krispie Kristina",
      price: 200,
      remaining: 150,
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
  ];

  // Animation when selecting event
  useEffect(() => {
    if (selectedEvent) {
      setAnimationPhase(1);
    }
  }, [selectedEvent]);

  const handleProceedToPayment = () => {
    if (!name || !email || !phone) {
      alert("Please fill all the required fields");
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowQR(true);
    }, 1500);
  };

  const handleEventSelect = (event: (typeof events)[0]) => {
    setSelectedEvent(event);
    // Reset form when changing events
    if (selectedEvent?.id !== event.id) {
      setQuantity(1);
      setPaymentVerified(false);
    }
  };

  const totalAmount = selectedEvent ? selectedEvent.price * quantity : 0;

  // Generate random ticket number
  const ticketNumber = `SHISHIR-${Math.floor(Math.random() * 90000) + 10000}`;
  
  const handleDownloadTicket = () => {
    if (!ticketRef.current) return;

    setIsLoading(true);

    html2canvas(ticketRef.current as HTMLDivElement, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    }).then((canvas: HTMLCanvasElement) => {
      const link: HTMLAnchorElement = document.createElement("a");
      link.download = `SHISHIR_Ticket_${ticketNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsLoading(false);
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-indigo-950 font-sans text-white pt-16 mb-16">
      <div className="w-full max-w-4xl h-full bg-indigo-950 bg-opacity-95 shadow-2xl overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-amber-500 opacity-10 blur-xl animate-pulse"></div>
          <div
            className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-indigo-500 opacity-10 blur-xl"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-amber-300 opacity-10 blur-xl"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        {/* Decorative ticket elements */}
        <div className="absolute left-0 top-10 w-8 h-16 bg-indigo-950 rounded-r-full"></div>
        <div className="absolute right-0 top-10 w-8 h-16 bg-indigo-950 rounded-l-full"></div>
        <div className="absolute left-0 bottom-10 w-8 h-16 bg-indigo-950 rounded-r-full"></div>
        <div className="absolute right-0 bottom-10 w-8 h-16 bg-indigo-950 rounded-l-full"></div>

        {/* Content container */}
        <div className="relative z-10 p-6 h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Header - Always visible */}
          <div className="flex flex-col items-center mb-8 animate-fadeIn">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 mb-2">
              SHISHIR 2025
            </h1>
            <div className="relative">
              <p className="text-xl text-amber-200">
                Annual College Fest Tickets
              </p>
              <div className="absolute -left-16 -right-16 top-1/2 border-t border-dashed border-amber-500 opacity-30 z-0"></div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-16 h-16 border-4 border-t-amber-400 border-b-amber-400 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-amber-300 font-medium">
                  {showQR && paymentVerified
                    ? "Preparing your ticket..."
                    : "Processing..."}
                </p>
              </div>
            ) : !showQR ? (
              <>
                {/* Event Selection */}
                <div
                  className={`transition-all duration-700 ease-in-out transform ${
                    animationPhase > 0
                      ? "scale-95 opacity-70"
                      : "scale-100 opacity-100"
                  }`}
                >
                  <h2 className="text-2xl font-bold text-amber-300 mb-4 flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center bg-amber-400 text-indigo-900 rounded-full mr-2 text-sm">
                      1
                    </span>
                    Select Your Event
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-500 border relative overflow-hidden group ${
                          selectedEvent?.id === event.id
                            ? "border-amber-400 bg-gradient-to-br from-indigo-900 to-indigo-800 transform scale-100"
                            : "border-indigo-700 bg-indigo-800 hover:bg-indigo-900 hover:border-amber-300"
                        }`}
                        onClick={() => handleEventSelect(event)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-300 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <h3 className="text-lg font-semibold text-amber-300">
                          {event.name}
                        </h3>
                        <div className="flex justify-between mt-2">
                          <span className="text-indigo-200">{event.date}</span>
                          <span className="font-bold text-amber-400">
                            ₹{event.price}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-indigo-300">
                          Featuring: {event.artist}
                        </div>
                        <div className="mt-1 text-xs text-indigo-400">
                          {event.remaining} tickets remaining
                        </div>
                        {selectedEvent?.id === event.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-indigo-900">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEvent && (
                  <>
                    {/* Ticket Quantity */}
                    <div
                      className={`my-8 transition-all duration-700 ease-in-out transform delay-100 ${
                        animationPhase === 0
                          ? "translate-y-10 opacity-0"
                          : "translate-y-0 opacity-100"
                      }`}
                    >
                      <h2 className="text-2xl font-bold text-amber-300 mb-4 flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-amber-400 text-indigo-900 rounded-full mr-2 text-sm">
                          2
                        </span>
                        Ticket Quantity
                      </h2>
                      <div className="flex items-center bg-indigo-800 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-800 opacity-50"></div>
                        <button
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-700 text-amber-300 text-xl font-bold hover:bg-indigo-600 transition-all duration-300 relative z-10"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          -
                        </button>
                        <div className="mx-6 text-xl font-bold text-white relative z-10 w-6 text-center">
                          {quantity}
                        </div>
                        <button
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-700 text-amber-300 text-xl font-bold hover:bg-indigo-600 transition-all duration-300 relative z-10"
                          onClick={() =>
                            setQuantity(Math.min(10, quantity + 1))
                          }
                        >
                          +
                        </button>
                        <div className="ml-auto text-right relative z-10">
                          <div className="text-indigo-200">
                            Price per ticket
                          </div>
                          <div className="text-xl font-bold text-amber-400">
                            ₹{selectedEvent.price}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personal Details */}
                    <div
                      className={`mb-8 transition-all duration-700 ease-in-out transform delay-200 ${
                        animationPhase === 0
                          ? "translate-y-10 opacity-0"
                          : "translate-y-0 opacity-100"
                      }`}
                    >
                      <h2 className="text-2xl font-bold text-amber-300 mb-4 flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-amber-400 text-indigo-900 rounded-full mr-2 text-sm">
                          3
                        </span>
                        Your Details
                      </h2>
                      <div className="space-y-4 bg-indigo-800 p-4 rounded-lg border border-indigo-700">
                        <div>
                          <label className="block text-indigo-200 mb-1">
                            Full Name*
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 rounded-lg bg-indigo-900 border border-indigo-600 text-white focus:border-amber-400 focus:outline-none transition-all duration-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-indigo-200 mb-1">
                            Email Address*
                          </label>
                          <input
                            type="email"
                            className="w-full p-3 rounded-lg bg-indigo-900 border border-indigo-600 text-white focus:border-amber-400 focus:outline-none transition-all duration-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-indigo-200 mb-1">
                            Phone Number*
                          </label>
                          <input
                            type="tel"
                            className="w-full p-3 rounded-lg bg-indigo-900 border border-indigo-600 text-white focus:border-amber-400 focus:outline-none transition-all duration-300"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div
                      className={`mb-6 transition-all duration-700 ease-in-out transform delay-300 ${
                        animationPhase === 0
                          ? "translate-y-10 opacity-0"
                          : "translate-y-0 opacity-100"
                      }`}
                    >
                      <div className="bg-indigo-900 bg-opacity-50 p-4 rounded-lg border border-indigo-700">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 mr-2"
                          />
                          <label
                            htmlFor="terms"
                            className="text-indigo-200 text-sm"
                          >
                            I agree to the Terms and Conditions of SHISHIR 2025.
                            I understand that:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>
                                Tickets are non-refundable and non-transferable
                              </li>
                              <li>
                                Entry will be permitted only with valid payment
                                proof
                              </li>
                              <li>
                                The organizers reserve the right to deny entry
                                without explanation
                              </li>
                              <li>College ID is mandatory for verification</li>
                              <li>
                                This ticket does not guarantee entry if venue
                                capacity is reached
                              </li>
                            </ul>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Total and Checkout */}
                    <div
                      className={`transition-all duration-700 ease-in-out transform delay-400 ${
                        animationPhase === 0
                          ? "translate-y-10 opacity-0"
                          : "translate-y-0 opacity-100"
                      }`}
                    >
                      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-lg p-4 mb-6 border border-indigo-700 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5 mix-blend-overlay"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between mb-2">
                            <span className="text-indigo-200">
                              Subtotal ({quantity} ticket
                              {quantity > 1 ? "s" : ""})
                            </span>
                            <span className="text-white">
                              ₹{selectedEvent.price * quantity}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-indigo-200">Booking Fee</span>
                            <span className="text-white">₹0</span>
                          </div>
                          <div className="border-t border-dashed border-indigo-600 my-2 pt-2 flex justify-between">
                            <span className="text-lg font-bold text-white">
                              Total
                            </span>
                            <span className="text-xl font-bold text-amber-400">
                              ₹{totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="w-full py-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-indigo-900 font-bold text-lg hover:from-amber-400 hover:to-amber-300 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                        onClick={handleProceedToPayment}
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-300 to-amber-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                        <span className="relative z-10 flex items-center justify-center">
                          <span>Proceed to Payment</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              // QR Code Payment Screen with ticket design
              <div className="flex flex-col items-center animate-fadeIn">
                <div
                  ref={ticketRef}
                  className="w-full max-w-md bg-gradient-to-b from-indigo-900 to-indigo-800 rounded-lg shadow-xl overflow-hidden border-2 border-amber-500 relative transform transition-all duration-500 animate-float"
                >
                  {/* Ticket holes */}
                  <div className="absolute left-0 top-24 w-6 h-12 bg-indigo-950 rounded-r-full"></div>
                  <div className="absolute right-0 top-24 w-6 h-12 bg-indigo-950 rounded-l-full"></div>

                  {/* Ticket header with logos */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-4 text-center relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      {/* College Logo */}
                      <img
                        src="/assets/NITM.png"
                        alt="College Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      {/* Event Logo */}
                        <img
                        src="/assets/logo.png"
                        alt="Event Logo"
                        className="w-8 h-8 object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-indigo-900">
                      SHISHIR 2025
                    </h2>
                    <p className="text-indigo-800 font-medium">
                      Annual College Fest E-Ticket
                    </p>
                  </div>

                  {/* Ticket content */}
                  <div className="p-6 flex flex-col items-center">
                    <div className="mb-4 flex flex-col items-center">
                      <p className="text-sm text-indigo-300 uppercase">
                        {paymentVerified ? "Payment Verified" : "Scan to Pay"}
                      </p>
                      <p className="text-2xl font-bold text-amber-400 mb-1">
                        ₹{totalAmount}
                      </p>
                      <p className="text-xs text-indigo-300">
                        Ticket #{ticketNumber}
                      </p>
                    </div>

                    <div className="w-48 h-48 bg-white p-2 rounded-lg mb-4 relative">
                      {paymentVerified ? (
                        <div className="w-full h-full flex items-center justify-center bg-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <>
                          <img
                            src="/qr.png"
                            alt="Scan to Pay via UPI"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-90 bg-black bg-opacity-70 transition-opacity duration-300">
                            <p className="text-white text-xs text-center p-2">
                              Scan with any UPI app and enter{" "}
                              <span className="font-bold">₹{totalAmount}</span>
                              <br />
                              <span className="text-amber-300">
                                (Note: Manually enter amount)
                              </span>
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="border-t border-dashed border-indigo-600 w-full my-4"></div>

                    <div className="text-center w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-indigo-300">Event:</span>
                        <span className="text-white font-medium">
                          {selectedEvent?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-indigo-300">Date:</span>
                        <span className="text-white">
                          {selectedEvent?.date || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-indigo-300">Artist:</span>
                        <span className="text-white">
                          {selectedEvent?.artist || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-indigo-300">Quantity:</span>
                        <span className="text-white">
                          {quantity} ticket{quantity > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-indigo-300">Name:</span>
                        <span className="text-white">{name}</span>
                      </div>
                    </div>

                    {/* Important Notice */}
                    <div className="mt-4 p-3 bg-indigo-950 rounded-lg border border-indigo-700 text-xs text-center">
                      <p className="text-amber-300 font-bold">
                        Important Notice
                      </p>
                      <p className="text-indigo-300 mt-1">
                        This ticket is valid only when presented with payment
                        proof and college ID. Unauthorized duplication will
                        result in denied entry.
                      </p>
                    </div>
                  </div>

                  {/* <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-2 text-center">
                  <p className="text-xs text-indigo-900">Your e-tickets will be sent to {email}</p>
                </div> */}
                </div>

                <div className="mt-8 bg-indigo-900 p-4 rounded-lg text-center max-w-md">
                  {!paymentVerified ? (
                    <>
                      <p className="text-amber-300 font-bold mb-2">
                        Payment Instructions
                      </p>
                      <p className="text-indigo-200 text-sm mb-4">
                        1. Scan the QR code using any UPI app (GPay, PhonePe,
                        Paytm)
                        <br />
                        2.{" "}
                        <span className="font-bold text-amber-300">
                          Manually enter ₹{totalAmount}
                        </span>
                        <br />
                        3. Complete the payment and verify below
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          className="py-2 px-4 rounded-lg bg-indigo-800 text-amber-300 font-bold hover:bg-indigo-700 transition-all duration-300"
                          onClick={() => setShowQR(false)}
                        >
                          Back to Ticket Selection
                        </button>
                        <button
                          className="py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-green-400 text-white font-bold hover:from-green-400 hover:to-green-300 transition-all duration-300"
                          onClick={() => {
                            setIsLoading(true);
                            setTimeout(() => {
                              setIsLoading(false);
                              setPaymentVerified(true);
                              submitToGoogleSheet();
                            }, 1000);
                          }}
                        >
                          Verify Payment
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-green-300 font-bold mb-2">
                        Payment Verified Successfully!
                      </p>
                      <p className="text-indigo-200 text-sm mb-4">
                        Thank you for your purchase. Please download your ticket
                        and keep it with your payment proof for entry.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          className="py-2 px-4 rounded-lg bg-indigo-800 text-amber-300 font-bold hover:bg-indigo-700 transition-all duration-300"
                          onClick={() => setShowQR(false)}
                        >
                          Back to Ticket Selection
                        </button>
                        <button
                          className="py-2 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-indigo-900 font-bold hover:from-amber-400 hover:to-amber-300 transition-all duration-300"
                          onClick={handleDownloadTicket}
                        >
                          Download Ticket
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-indigo-800 text-center text-indigo-400 text-sm">
              <p>SHISHIR 2025 • Annual College Cultural Fest</p>
              <p className="text-xs mt-1 text-indigo-500">
                Powered by Shishir Ticket System
              </p>
            </div>
          </div>
        </div>

        {/* Add keyframes for animations */}
        <style jsx>{`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-float {
            animation: float 4s ease-in-out infinite;
          }

          .animate-fadeIn {
            animation: fadeIn 0.5s forwards;
          }

          /* Hide scrollbar but maintain functionality */
          .scrollbar-hide {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}</style>
      </div>
    </div>
  );
};

export default ShishirTicketSeller;
