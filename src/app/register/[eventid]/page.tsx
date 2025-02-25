'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import eventsData from '@/data/eventsData';

const DynamicForm = dynamic(() => import('@/components/register-form/DynamicForm'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-64">
      <div className="h-16 w-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  ),
});

export default function EventPage() {
  const pathname = usePathname();
  const eventId = pathname.split('/').pop() || '';
  
  // Find the event in eventsData
  let eventInfo = null;
  for (const categoryEvents of Object.values(eventsData)) {
    const foundEvent = categoryEvents.find(event => event.code === eventId);
    if (foundEvent) {
      eventInfo = foundEvent;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Event Registration: {eventInfo?.name || eventId}
        </h1>
        
        {eventInfo?.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto mb-8"
          >
            <img
              src={eventInfo.image}
              alt={`${eventInfo.name} poster`}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </motion.div>
        )}
        
        <DynamicForm 
          eventId={eventId}
          eventName={eventInfo?.name}
          min={eventInfo?.min}
          max={eventInfo?.max}
        />
      </motion.div>
    </div>
  );
}