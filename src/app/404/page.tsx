'use client'
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  return ( 
    <div className='w-full pt-20 h-screen flex flex-col sm:flex-row lg:flex justify-center items-center'
         style={{ background: 'radial-gradient(ellipse at bottom, #C2B59B 0%, #8B6F47 40%, #000022 100%)' }}>
        <div className='text sm:w-1/3 sm:h-2/3 backdrop-blur-sm bg-white/10 bg-opacity-70 rounded-none sm:rounded-s-xl'>
            <div className='sm:h-1/2 flex justify-center'>
                <DotLottieReact
                    src="/assets/404.lottie"
                    loop
                    autoplay
                    className='object-cover w-[50vw]'
                />
            </div>
            <div className='sm:h-1/2'>
                <h1 className='text-md sm:text-2xl px-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-500'>
                  The Dev team is working hard to bring this page back to life
                </h1>
                <h4 className='text-sm sm:text-md p-5 text-[#3d3125] font-bold text-center'>
                  Meanwhile, why don’t you try going
                </h4> 
                <div className='flex justify-center'>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-3 text-lg font-mono font-semibold text-gray-700 bg-[#fafafa] rounded-xl shadow-md transition-all duration-200
                                   hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-inner focus:outline-none"
                    >
                        Back Home
                    </button>
                </div>
            </div>
        </div>
        <div className='lottie sm:w-1/3 sm:h-2/3 flex justify-center backdrop-blur-sm bg-white/10 bg-opacity-70 w-full rounded-none sm:rounded-e-xl'>
            <DotLottieReact
                src="/assets/404_cat.lottie"
                loop
                autoplay
                className='object-cover w-[100%] sm:w-[50vw]'
            />
        </div>
    </div>
  );
};

export default NotFoundPage;
