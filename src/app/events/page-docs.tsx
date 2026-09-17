/**
 * @file page-docs.tsx
 * @description This file is the documented version of the main Events page component.
 * It displays a list of events grouped by category and provides a detailed modal view for each event.
 */

"use client"; // Marks this as a Client Component in Next.js, meaning it will be rendered on the client side, allowing the use of React hooks like useState and useEffect.

// React and Next.js imports
import React from "react";
import Image from "next/image"; // Next.js optimized Image component for better performance (lazy loading, optimized sizing).
import { useEffect, useState } from "react"; // React hooks for managing state and side effects.
import Head from "next/head"; // Next.js component to modify the <head> of the HTML document (used here for preloading).

// Custom component imports
import Inav from "@/components/events/internal-nav"; // Internal navigation component used to jump to specific event categories.

// Icon imports from Lucide-React
import { CalendarDays, Crown, ExternalLink, Mail, MapPin, Phone, Sparkles, X } from "lucide-react";

/**
 * @type {EventRecord}
 * @description Represents the structure of an Event object as fetched from the backend API.
 */
type EventRecord = {
  _id: string; // Unique identifier for the event
  name: string; // Name of the event
  code: string; // Unique short code for the event, used in URLs (e.g., for registration)
  category: string; // The category this event belongs to (e.g., Technical, Cultural)
  location: string; // Venue of the event
  startsAt: string; // Start date and time in ISO format
  endsAt: string; // End date and time in ISO format
  description: string; // Detailed description of the event
  rulebookLink: string; // External link to the event's rulebook (e.g., Google Drive link)
  posterLink: string; // URL for the event's poster image
  eventHeads: Person[]; // Array of people managing the event at the top level
  coordinators: Person[]; // Array of coordinators for the event
  coCoordinators: Person[]; // Array of co-coordinators for the event
};

/**
 * @type {Person}
 * @description Represents a person involved in organizing an event (Heads, Coordinators, etc.).
 */
type Person = {
  name: string; // Full name of the person
  collegeID?: string; // Optional roll number or college ID
  phone?: string; // Optional phone number
  email?: string; // Optional email address
  image?: string; // Optional profile image URL
};

// Default profile image to display if a Person doesn't have an image specified
const fallbackProfileImage = "/assets/profile-icon.svg";

/**
 * Formats an ISO date string into a readable format (e.g., "17 Sep 2026").
 * @param {string} value - The ISO date string.
 * @returns {string} The formatted date string.
 */
function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * Formats an ISO date string to extract just the time (e.g., "10:30 am").
 * @param {string} value - The ISO date string.
 * @returns {string} The formatted time string.
 */
function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

/**
 * @component PeopleGroup
 * @description A reusable component to render a group of people (like Event Heads or Coordinators).
 * It displays their name, image, roll number, and contact info if available.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.label - The title for this group of people (e.g., "Event Heads").
 * @param {Person[]} props.people - The array of person objects to display.
 */
function PeopleGroup({ label, people }: { label: string; people: Person[] }) {
  // If the people array is empty or undefined, don't render anything
  if (!people?.length) return null;

  return (
    <div>
      {/* Group Title */}
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">{label}</p>

      {/* Grid container for people cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {people.map((person) => (
          // Individual person card
          <div key={`${label}-${person.collegeID || person.email || person.name}`} className="flex min-w-0 items-start gap-3 rounded-lg border border-yellow-400/20 bg-black/30 p-3">

            {/* Person's Avatar */}
            <Image
              src={person.image || fallbackProfileImage}
              alt=""
              width={30}
              height={30}
              className="h-7 w-7 rounded-full object-cover"
            />

            {/* Person's Details */}
            <div className="min-w-0 space-y-1 text-sm">
              <p className="break-words font-semibold text-gray-100">{person.name}</p>
              {person.collegeID && <p className="break-words text-gray-400">Roll no: {person.collegeID}</p>}

              {/* Phone number link (opens dialer) */}
              {person.phone && (
                <a href={`tel:${person.phone}`} className="flex break-all items-center gap-1 text-yellow-300 hover:text-yellow-200">
                  <Phone size={13} />
                  {person.phone}
                </a>
              )}

              {/* Email link (opens default email client) */}
              {person.email && (
                <a href={`mailto:${person.email}`} className="flex break-all items-center gap-1 text-yellow-300 hover:text-yellow-200">
                  <Mail size={13} />
                  {person.email}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * @component EventDetailsModal
 * @description A modal dialog that pops up to show detailed information about a selected event.
 * 
 * @param {Object} props - The component props.
 * @param {EventRecord} props.event - The event data to display in the modal.
 * @param {Function} props.onClose - Callback function triggered when the user attempts to close the modal.
 */
function EventDetailsModal({ event, onClose }: { event: EventRecord; onClose: () => void }) {
  // useEffect hook to handle the Escape key for closing the modal and disabling background scrolling
  useEffect(() => {
    // Function to handle keydown events
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      // If the 'Escape' key is pressed, call the onClose function
      if (keyboardEvent.key === "Escape") onClose();
    };

    // Disable scrolling on the main body while the modal is open
    document.body.style.overflow = "hidden";
    // Listen for keypresses globally
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function: runs when the modal is closed or unmounted
    return () => {
      // Re-enable body scrolling
      document.body.style.overflow = "";
      // Remove the global event listener to prevent memory leaks
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]); // Dependency array: Re-run this effect if onClose changes

  return (
    // Modal Overlay (darkened background) - clicking on it also closes the modal (onMouseDown)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm" onMouseDown={onClose}>

      {/* Modal Content Box - stopPropagation prevents clicks inside the modal from bubbling up and closing it */}
      <div role="dialog" aria-modal="true" aria-labelledby="event-details-title" className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-yellow-500/40 bg-white dark:bg-gray-950 shadow-2xl" onMouseDown={(eventMouseDown) => eventMouseDown.stopPropagation()}>

        {/* Close Button (X icon) */}
        <button type="button" onClick={onClose} aria-label="Close event details" className="sticky left-4 top-4 z-20 -mb-10 mr-auto block rounded-full bg-slate-100 dark:bg-black/70 p-2 text-yellow-600 dark:text-yellow-300 transition hover:bg-yellow-400 hover:text-black">
          <X size={20} />
        </button>

        {/* Modal Grid Layout: Left side is details, Right side is the poster image */}
        <div className="grid min-h-[55vh] md:grid-cols-[1fr_0.9fr]">

          {/* Left Column: Event Details */}
          <div className="order-2 flex flex-col gap-6 p-6 sm:p-8 md:order-1">
            {/* Header: Category & Title */}
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-400">{event.category.replace("_", " ")}</p>
              <h2 id="event-details-title" className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{event.name}</h2>
            </div>

            {/* Description Text */}
            <p className="whitespace-pre-wrap break-words leading-7 text-slate-700 dark:text-gray-300">{event.description}</p>

            {/* Event Meta Data (Date, Time, Location) */}
            <div className="grid gap-3 text-sm text-slate-800 dark:text-gray-200 sm:grid-cols-2">
              <p className="flex gap-2"><CalendarDays className="shrink-0 text-yellow-500" size={18} />{formatEventDate(event.startsAt)}</p>
              <p className="flex gap-2"><MapPin className="shrink-0 text-yellow-500" size={18} />{event.location}</p>
              <p><span className="text-yellow-600 dark:text-yellow-400 font-semibold">Start:</span> {formatEventTime(event.startsAt)}</p>
              <p><span className="text-yellow-600 dark:text-yellow-400 font-semibold">End:</span> {formatEventTime(event.endsAt)}</p>
            </div>

            {/* Organizers Section */}
            <div className="space-y-4 border-t border-yellow-400/20 pt-5">
              <PeopleGroup label="Event Heads" people={event.eventHeads} />
              <PeopleGroup label="Coordinators" people={event.coordinators} />
              <PeopleGroup label="Co-coordinators" people={event.coCoordinators} />
            </div>

            {/* Action Buttons (Rulebook & Register) */}
            <div className="mt-auto flex flex-col gap-3 border-t border-yellow-400/20 pt-5 sm:flex-row">
              <a
                href={event.rulebookLink}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-yellow-400/40 px-4 py-3 text-center font-semibold text-yellow-300 transition hover:bg-yellow-400/10"
              >
                <ExternalLink size={18} />
                View Rulebook
              </a>
              <a
                href={`/register/${event.code}`}
                className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-3 text-center font-bold text-black transition hover:shadow-lg hover:shadow-yellow-500/25"
              >
                Register Now
              </a>
            </div>
          </div>

          {/* Right Column: Event Poster */}
          <div className="relative order-1 flex min-h-[280px] items-center justify-center bg-black md:order-2 md:min-h-0">
            <Image src={event.posterLink} alt={`${event.name} poster`} fill className="object-contain object-center" sizes="(max-width: 768px) 100vw, 45vw" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @component Events (Default Export)
 * @description The main page component that renders the full events page.
 * It fetches the list of events from the API and displays them grouped by category.
 */
export default function Events() {
  // --- State Variables ---
  // State to hold the array of fetched events.
  const [events, setEvents] = useState<EventRecord[]>([]);
  // State to track if the fetch operation is currently in progress.
  const [loading, setLoading] = useState(true);
  // State to hold any error messages if the fetch fails.
  const [error, setError] = useState("");
  // State to track which event has been selected by the user to view in the modal. (null = modal closed)
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);

  // --- useEffect Hook for Data Fetching ---
  // Runs once when the component is first mounted to the screen.
  useEffect(() => {
    // Defines the asynchronous function to fetch data
    async function fetchEvents() {
      try {
        // Makes a GET request to our backend API endpoint
        const response = await fetch("/api/events");
        const data = await response.json(); // Parses the response body as JSON

        // Check if the HTTP status is not OK or if our custom success flag is false
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load events"); // Throw error to be caught in catch block
        }

        // If successful, update the events state with the data array
        setEvents(data.events);
      } catch (fetchError) {
        // If an error occurs (network failure or thrown error above), update the error state
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load events");
      } finally {
        // Regardless of success or failure, stop the loading state
        setLoading(false);
      }
    }

    // Immediately invoke the fetch function
    fetchEvents();
  }, []); // Empty dependency array ensures this effect only runs once on mount.

  // --- Data Processing ---
  // Extract unique categories from the list of fetched events to use as section headers.
  // Set removes duplicates, and Array.from converts it back to an array.
  const eventCategories = Array.from(new Set(events.map((event) => event.category)));

  return (
    <>
      {/* Head component injects this into the HTML <head> to preload the background image for performance */}
      <Head>
        <link rel="preload" href="/img/brickwall.webp" as="image" />
      </Head>

      {/* Main Container - Has a brickwall background with a gradient overlay */}
      <div
        className="relative flex flex-col items-center w-full h-auto min-h-screen overflow-x-hidden pb-16"
        style={{ backgroundImage: `url('/img/brickwall.webp')` }}
      >
        {/* Semi-transparent Gradient overlay on top of the brick background for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-slate-100/90 to-white/95 dark:from-gray-900/80 dark:to-black/80 pointer-events-none transition-colors duration-300" />

        {/* Content container (Everything sits on top of the background) */}
        <div className="relative w-full">

          {/* Header Section: Page Title "EVENTS" with glowing Crown icons */}
          <div className="text-center mt-20 mb-12">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 pt-10">
                EVENTS
              </h1>
              <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
            </div>
            {/* Underline decorative bar */}
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
          </div>

          {/* Internal Navigation Component: Passes the unique categories to render quick-jump links */}
          <Inav categories={eventCategories} />

          {/* Conditional Rendering based on state */}
          {/* Show loading message if data is still fetching */}
          {loading && <p className="text-center text-yellow-400 text-xl">Loading events...</p>}
          {/* Show error message if fetch failed */}
          {!loading && error && <p className="text-center text-red-300 text-xl">{error}</p>}
          {/* Show empty state message if fetch succeeded but returned no events */}
          {!loading && !error && eventCategories.length === 0 && (
            <p className="text-center text-gray-300 text-xl">No events available.</p>
          )}

          {/* Iterate over each unique category to render sections */}
          {!loading && !error && eventCategories.map((category) => (
            <React.Fragment key={category}>

              {/* --- Category Header Block --- */}
              <div
                id={category.toLowerCase().replace(/ /g, "-")} // ID is used for anchor links (jumping to section from Inav)
                className="relative mx-4 sm:mx-6 md:mx-8 lg:mx-10 my-4 sm:my-6 md:my-8 lg:my-10 overflow-hidden"
              >
                {/* Decorative glowing gradient border for the category header */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 animate-gradient-x 
    rounded-tl-[20px] rounded-br-[20px] 
    sm:rounded-tl-[25px] sm:rounded-br-[25px]
    md:rounded-tl-[30px] md:rounded-br-[30px]
    lg:rounded-tl-[40px] lg:rounded-br-[40px]"
                />

                {/* Inner background of the category header */}
                <div
                  className="relative bg-gradient-to-r from-slate-100 to-white dark:from-gray-900 dark:to-black m-0.5 
    p-3 sm:p-4 md:p-5 lg:p-6
    rounded-tl-[18px] rounded-br-[18px]
    sm:rounded-tl-[23px] sm:rounded-br-[23px]
    md:rounded-tl-[28px] md:rounded-br-[28px]
    lg:rounded-tl-[38px] lg:rounded-br-[38px] transition-colors duration-300"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-yellow-400" />

                    {/* Display the Category Name, replacing underscores with spaces (e.g., "TECHNICAL_EVENTS" -> "TECHNICAL EVENTS") */}
                    <h2
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold 
        text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600
        whitespace-nowrap"
                    >
                      {category.replace("_", " ")}
                    </h2>

                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* --- Events Grid for this Category --- */}
              <div className="w-[90vw] mx-auto">
                <div className="flex flex-wrap justify-center gap-8">
                  {/* Filter the full events list to only show events matching the current category loop iteration */}
                  {events
                    .filter((event) => event.category === category)
                    .map((event, index) => (

                      // Individual Event Card
                      <div
                        key={event._id || event.code}
                        className="w-full max-w-[400px] aspect-square rounded-xl shadow-2xl relative overflow-hidden group transform transition-all duration-500 hover:scale-105"
                      >
                        {/* Animated gradient border behind the card content */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-gradient-x rounded-tl-[20px] rounded-br-[20px]" />

                        {/* Card Content Wrapper */}
                        <div className="absolute inset-0.5 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-tl-[18px] rounded-br-[18px]">

                          {/* Event Poster Image serving as card background */}
                          <Image
                            src={event.posterLink}
                            alt={event.name}
                            fill
                            style={{ objectFit: "cover" }} // Image covers entire area
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive sizes for optimization
                            quality={75}
                            priority={index < 4} // Preload images for the first 4 events to improve initial load time (LCP)
                            className="transition-transform duration-500 group-hover:scale-110" // Zoom-in effect on hover
                          />

                          {/* Event Name & Actions Overlay - This slides up when the user hovers over the card */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent text-white p-4 transform transition-transform duration-500 translate-y-full group-hover:translate-y-0 rounded-b-xl">
                            <p className="font-bold text-2xl text-yellow-400 mb-2">
                              {event.name}
                            </p>

                            {/* Action Buttons for the specific event */}
                            <div className="flex flex-col gap-3">
                              {/* Link to Registration Page */}
                              <a
                                href={`/register/${event.code}`}
                                className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 px-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
                              >
                                Register Now
                              </a>

                              {/* Button to open the Details Modal */}
                              <button
                                type="button"
                                // Sets the selectedEvent state to this specific event, which triggers the Modal to render
                                onClick={() => setSelectedEvent(event)}
                                className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 text-yellow-400 border border-yellow-400/30 font-bold py-2 px-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/10"
                              >
                                View Event
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Modal Rendering: Only render EventDetailsModal if selectedEvent is not null. 
          When closed, it calls setSelectedEvent(null) to unmount the modal. */}
      {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </>
  );
}
