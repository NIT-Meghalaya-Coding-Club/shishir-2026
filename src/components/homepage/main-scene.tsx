import Image from 'next/image'
import Rbutton from './register-button' 

export default function MainScene() {
  return (
    <div className="relative w-full flex items-center justify-center ">
      <div className="relative w-full h-full aspect-[16/9]">
        <Image
          src="/img/bg_gif.gif"
          alt="Main Scene GIF"
          fill
          priority
          unoptimized
        />
      </div>
      <div className="absolute bottom-0 right-8">
        <div className=" rounded-full cursor-pointer hover:scale-105 transition-transform">
          <Rbutton/>
        </div>
      </div>
      
    </div>
  )
}