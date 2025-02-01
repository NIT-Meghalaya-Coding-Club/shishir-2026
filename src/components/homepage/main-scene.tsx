import Image from 'next/image'
import Rbutton from './register-button' 

export default function MainScene() {
  return (
    <div className="relative w-full flex items-center justify-center bg-[#0b101d]">
      <div className="relative w-full  h-[calc(100vh)]">
        <Image
          src="/img/img.png"
          alt="Main Scene GIF"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover shadow-xl rounded-b-2xl"
          unoptimized
        />
      </div>
      <div className="absolute bottom-0 right-8">
        <div className=" rounded-full cursor-pointer hover:scale-105 transition-transform">
          <Rbutton/>
        </div>
      </div>
    </div>
  );
}