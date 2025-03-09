"use client";
import { useState, useRef, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { ReactNode } from "react";
import Image from "next/image";


export const NumberCounter = ({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const step = end / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start > end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  // Calculate the maximum width needed
  const maxDigits = end.toString().length + 1; // +1 for the '+' sign

  return (
    <span
      ref={countRef}
      className="text-amber-400 inline-block"
      style={{
        minWidth: `${maxDigits}ch`,
        textAlign: 'left',
      }}
    >
      {count}<span className="font-bold"> +</span>
    </span>
  );
};

// Enhanced BentoTilt with more dramatic effects
export const BentoTilt = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [transformStyle, setTransformStyle] = useState("");
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: { clientX: number; clientY: number }) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 7; // Increased tilt effect
    const tiltY = (relativeX - 0.5) * -7;

    setGlowPosition({ x: relativeX * 100, y: relativeY * 100 });
    const newTransform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={`relative ${className} transition-transform duration-300 ease-out`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(234, 179, 8, 0.15), transparent 25%)`,
      }}
    >
      {children}
    </div>
  );
};

// Enhanced BentoCard with royal styling
export const BentoCard = ({
  src,
  title,
  description,
  isComingSoon,
}: {
  src: string;
  title: ReactNode;
  description?: string;
  isComingSoon?: boolean;
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: { clientX: number; clientY: number }) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full overflow-hidden rounded-lg border border-amber-500/30">
      {src.endsWith(".mp4") ? (
        <video
          src={src}
          loop
          muted
          autoPlay
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
      ) : (
        <Image
          src={`/${src}`}
          width="0"
          height="0"
          sizes="100svw"
          alt=""
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-black/70" />
      <div className="relative z-10 flex size-full flex-col justify-between p-6 text-blue-50">
        <div className="transform transition-transform duration-300 hover:scale-105">
          <h1 className="bento-title special-font bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-64 text-sm font-light tracking-wide text-blue-100 md:text-base">
              {description}
            </p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative flex w-fit cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-6 py-3 text-sm uppercase text-white shadow-lg transition-all duration-300 hover:shadow-amber-500/20"
          >
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(251, 191, 36, 0.4), transparent)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Events = () => (
  <section className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-950 to-black pb-20 sm:pb-24 lg:pb-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-10">
      {/* Hero Text Section */}
      <div className="relative px-4 py-16 sm:py-24 lg:py-32 text-center">
        <div className="absolute inset-0 opacity-10" />
        <p className="relative mx-auto max-w-3xl font-circular-web text-base sm:text-lg lg:text-2xl text-blue-50 leading-relaxed">
          Experience the cultural extravaganza with{" "}
          <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text font-bold text-transparent">
            30+ events
          </span>{" "}
          across clubs, featuring national and international artists, bringing
          together thousands of participants in a celebration of creativity and
          talent.
        </p>
      </div>

      {/* Feature Video Card */}
      <BentoTilt className="mb-4 sm:mb-7 h-[300px] sm:h-[400px] lg:h-[65vh] overflow-hidden rounded-lg border border-amber-500/30 shadow-lg shadow-amber-500/10">
        <BentoCard
          src="videos/feature-1.mp4"
          title={
            <>
              <NumberCounter end={30} /> Events
            </>
          }
          description="Dive into a diverse range of events spanning across multiple clubs, showcasing extraordinary talent in music, dance, art, and more."
        />
      </BentoTilt>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-7">
        {/* Artists Card */}
        <div className="sm:row-span-2">
          <BentoTilt className="h-[300px] sm:h-full overflow-hidden rounded-lg border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <BentoCard
              src="videos/artists.mp4"
              title={
                <>
                  <NumberCounter end={15} /> Artists
                </>
              }
              description="Witness spectacular performances by national and international artists live at SHISHIR 2025."
            />
          </BentoTilt>
        </div>

        {/* Ambassadors Card */}
        <BentoTilt className="h-[250px] sm:h-[300px] overflow-hidden rounded-lg border border-amber-500/30 shadow-lg shadow-amber-500/10">
          <BentoCard
            src="videos/footfall.jpg"
            title={
              <>
                <NumberCounter end={150} /> Ambassadors
              </>
            }
            description="Join our elite network of college ambassadors representing SHISHIR across the nation."
          />
        </BentoTilt>

        {/* Footfall Card */}
        <BentoTilt className="h-[250px] sm:h-[300px] overflow-hidden rounded-lg border border-amber-500/30 shadow-lg shadow-amber-500/10">
          <BentoCard
            src="videos/crowd.jpg"
            title={
              <>
                <NumberCounter end={2000} /> Footfall
              </>
            }
            description="Be part of our biggest gathering yet, surpassing last year's record-breaking attendance."
          />
        </BentoTilt>

        {/* Expected Card */}
        <BentoTilt className="h-[250px] sm:h-[300px] overflow-hidden rounded-lg border border-amber-500/30 shadow-lg shadow-amber-500/10">
          <div className="flex h-full flex-col justify-between bg-gradient-to-br from-blue-900 to-blue-950 p-4 sm:p-6">
            <h1 className="bento-title  w-full bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-3xl sm:text-4xl lg:text-6xl text-transparent">
              <NumberCounter end={2500} /> Expected
            </h1>
            <TiLocationArrow className="m-3 sm:m-5 scale-[3] sm:scale-[5] self-end text-amber-400" />
          </div>
        </BentoTilt>

        {/* Video Card */}
        <BentoTilt className="h-[250px] sm:h-[300px] overflow-hidden rounded-lg border border-amber-500/30 shadow-lg shadow-amber-500/10">
          <video
            src="videos/feature-5.mp4"
            loop
            muted
            autoPlay
            playsInline
            className="h-full w-full object-cover object-center"
          />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Events;
