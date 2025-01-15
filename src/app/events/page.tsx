import React from 'react'
import Inav from '@/components/events/internal-nav'
import Navigation from '@/components/homepage/navigation'
import Eventlist from '@/components/homepage/event-list'
const page = () => {
    const eventsData = [
        {
          title: "Sonu Nigam",
          subtitle: "HEADLINER LAUNCH",
          image: "/img/event/poster.jpg"
        },
        {
          title: "Harsh Gujral",
          subtitle: "COMEDY NIGHT",
          image: "/img/event/poster.jpg"
        },
        {
          title: "RAFTAAR",
          subtitle: "HEADLINER LAUNCH",
          image: "/img/event/poster.jpg"
        },
        {
          title: "Armaan Malik",
          subtitle: "HEADLINER LAUNCH",
          image: "/img/event/poster.jpg"
        }
      ];
  return (
    <>
        <div 
        className="relative flex flex-col items-center w-[100vw] h-auto" 
        style={{backgroundImage: `url('/img/brickwall.png')`,}}>
            <Navigation/>
            <Inav/>
            <Eventlist events={eventsData}/>
        </div>
        
    </>
  )
}

export default page