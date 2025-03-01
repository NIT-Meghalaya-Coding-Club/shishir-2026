'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import eventsData from '@/data/eventsData';
import { useEffect, useState } from 'react';
import Loading from '@/app/components/Loading';
import Image from 'next/image';


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
  const [event, setEvent] = useState({
    code: "-",
    name: "-",
    image: "-",
    registrationLink: "",
    rulebook: "",
    min: 0,
    max: 0,
  },);
  const [ isLoading, setIsLoading ] = useState(false);

  // Find the event in eventsData
  const eventInfo = null;
  // for (const categoryEvents of Object.values(eventsData)) {
  //   const foundEvent = categoryEvents.find(event => event.code === eventId);
  //   if (foundEvent) {
  //     eventInfo = foundEvent;
  //     break;
  //   }
  // }

  useEffect(() => {
    // console.log(eventId);
    setIsLoading(true);
    for (const categoryEvents of Object.values(eventsData)) {
      const foundEvent = categoryEvents.find(event => event.code === eventId);
      if (foundEvent) {
        console.log(eventInfo);
        setEvent(foundEvent);
        break;
      }
    }
    setIsLoading(false);
  }, [pathname, eventId])

  if(isLoading) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-950 to-black py-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4"
      >
        <h1 className="text-3xl font-bold text-center text-amber-500 mb-8">
          Event Registration: <span className='text-white'>{event?.name || eventId}</span>
        </h1>

        {event?.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto mb-8"
          >
            <Image
              src={`https://shishir.nitm.ac.in${event.image}`}
              width="0"
              height="0"
              sizes="100svw"
              alt={`${event.name} poster`}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </motion.div>
        )}

        <DynamicForm
          eventId={event?.code}
          eventName={event?.name}
          min={event?.min}
          max={event?.max}
        />
      </motion.div>
    </div>
  );
}