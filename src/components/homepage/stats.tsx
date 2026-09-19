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
  const spanRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const updateCount = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            const currentVal = Math.floor(progress * end);
            if (countRef.current) {
              countRef.current.textContent = currentVal.toString();
            }
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else if (countRef.current) {
              countRef.current.textContent = end.toString();
            }
          };
          requestAnimationFrame(updateCount);
        }
      },
      { threshold: 0.5 }
    );

    if (spanRef.current) {
      observer.observe(spanRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  // Calculate the maximum width needed
  const maxDigits = end.toString().length + 1; // +1 for the '+' sign

  return (
    <span
      ref={spanRef}
      className="text-amber-400 inline-block"
      style={{
        minWidth: `${maxDigits}ch`,
        textAlign: 'left',
      }}
    >
      <span ref={countRef}>0</span><span className="font-bold"> +</span>
    </span>
  );
};

// Enhanced BentoTilt with direct DOM style updates (zero React re-renders on mousemove)
export const BentoTilt = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 7;
    const tiltY = (relativeX - 0.5) * -7;
    const glowX = relativeX * 100;
    const glowY = relativeY * 100;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (itemRef.current) {
        itemRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`;
        itemRef.current.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(234, 179, 8, 0.15), transparent 25%)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (itemRef.current) {
      itemRef.current.style.transform = "";
      itemRef.current.style.background = "";
    }
  };

  return (
    <div
      ref={itemRef}
      className={`relative ${className} transition-transform duration-300 ease-out will-change-transform`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverButtonRef.current || !glowRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    glowRef.current.style.background = `radial-gradient(100px circle at ${x}px ${y}px, rgba(251, 191, 36, 0.4), transparent)`;
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
              ref={glowRef}
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
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
  <section className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-blue-950 dark:via-blue-950 dark:to-black pb-20 sm:pb-24 lg:pb-40 transition-colors duration-300">
    <div className="container mx-auto px-4 sm:px-6 lg:px-10">
      {/* Hero Text Section */}
      <div className="relative px-4 py-16 sm:py-24 lg:py-32 text-center">
        <div className="absolute inset-0 opacity-10" />
        <p className="relative mx-auto max-w-3xl font-circular-web text-base sm:text-lg lg:text-2xl text-slate-800 dark:text-blue-50 leading-relaxed font-normal dark:font-light transition-colors duration-300">
          Experience the cultural extravaganza with{" "}
          <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-300 dark:to-amber-500 bg-clip-text font-bold text-transparent">
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
