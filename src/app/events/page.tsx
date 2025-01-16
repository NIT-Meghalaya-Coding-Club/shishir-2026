'use client';
import React from 'react';
import Inav from '@/components/events/internal-nav'; 
import Eventlist from '@/components/homepage/event-list'; 
import eventsData from '@/data/eventsData'; 
import event_categories from '@/data/categoryData'; 

export default function HomePage() {
  return (
    <div
      className="relative flex flex-col items-center w-[100vw] h-auto"
      style={{ backgroundImage: `url('/img/brickwall.png')` }}
    >
      <Inav />

      {/* Dynamically generate sections for each category */}
      {event_categories.map((category, index) => (
        <React.Fragment key={index}>
          <div
            id={category.toLowerCase()} // Ensure IDs are lowercase for consistency
            className={`h-[15vh] m-10 p-4 bg-red-800 rounded-xl flex items-center justify-center bg-gray-${(index + 1) * 100}`}
          >
            <h1 className="text-4xl font-bold">{category.replace('_', ' ')}</h1>
          </div>
          <Eventlist events={eventsData} />
        </React.Fragment>
      ))}
    </div>
  );
}