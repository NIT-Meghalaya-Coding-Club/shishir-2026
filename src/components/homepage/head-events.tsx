import Image from 'next/image'
import Eventlist from './event-list'
import eventsData from '@/data/eventsData'

export default function HeadliningEvents() {
  return (
    <div 
        className="relative flex flex-col items-center justify-center w-[100vw] h-auto" 
        style={{backgroundImage: `url('/img/brickwall.png')`,}}>

      {/* Lotus Decorations */}
      <div className="absolute -left-1/4 top-0 w-[80vw] z-1">
        <Image
          src="/img/lotusleft.png"
          alt="Lotus decoration"
          width={2000}
          height={2000}
        />
      </div>
      <div className="absolute right-0 top-0 w-64 z-1">
        <Image
          src="/img/lotusright.png"
          alt="Lotus decoration"
          width={2000}
          height={2000}
        />
      </div>

      <p className='text-[#e69600] text-[10vw] font-serif overflow-x-hidden text-center drop-shadow-lg text-wrap m-0 box-border'>
        HEADLINING EVENTS
      </p>
    
      <Eventlist events={eventsData} />
      <Eventlist events={eventsData} />
      <div className='bg-[#030716] w-[100%] h-[50vh] z-30 flex' >
      <Image
          src="/img/wallend.png"
          alt="End of the wall"
          width={1500}
          height={600}
        />
      </div>
    </div>
  )
}