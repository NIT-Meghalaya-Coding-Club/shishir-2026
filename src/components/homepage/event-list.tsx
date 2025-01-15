import Image from 'next/image';

interface Event {
  title: string;
  subtitle: string;
  image: string;
}


interface EventListProps {
  events?: Event[]; 
}

export default function EventList({ events = [] }: EventListProps) {
  return (
    <>
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
    </>
  );
}