import Image from 'next/image'

export default function HeadliningEvents() {
  const events = [
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
  ]

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
    
      <div className='head_content relative w-[90vw] z-10 items-center place-content-evenly flex flex-wrap h-auto mb-[5%] m-0 p-0'>
        {events.map((event, index) => (
          <div key={index} className='head_details bg-[#6a000e] h-[40vh] relative overflow-hidden w-[40vh] m-0 p-0 border-4 border-black border-solid'>
            <Image
              src={event.image}
              alt={`Event Poster for ${event.title}`}
              width={500}
              height={500}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-sm">{event.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='head_content relative w-[90vw] z-10 items-center place-content-evenly flex flex-wrap h-auto mb-[5%] m-0 p-0'>
        {events.map((event, index) => (
          <div key={index} className='head_details bg-[#6a000e] h-[40vh] relative overflow-hidden w-[40vh] m-0 p-0 border-4 border-black border-solid'>
            <Image
              src={event.image}
              alt={`Event Poster for ${event.title}`}
              width={500}
              height={500}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-sm">{event.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
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