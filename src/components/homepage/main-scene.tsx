import Image from 'next/image';

export default function MainScene() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="relative w-full  h-[calc(100vh)]">
        <Image
          src="/img/img.jpg"
          alt="Main Scene GIF"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="absolute bottom-0 right-8">
        <div className="rounded-full cursor-pointer hover:scale-105 transition-transform">
          <Image
            src="/img/ml_stone.png"
            alt="Arrow Down"
            width={100}
            height={100}
            priority
          />
        </div>
      </div>
    </div>
  );
}