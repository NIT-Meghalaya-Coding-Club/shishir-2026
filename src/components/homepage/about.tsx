export default function About() {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#000717] to-[#001233] overflow-hidden">
            <div className="absolute inset-0 opacity-30">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="object-cover w-full h-full"
                >
                    <source src="/videos/about.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
                {/* Logo Section */}
                <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-[#d4a200] to-[#ffd960] mb-6 md:mb-8 special-font tracking-wider transform hover:scale-105 transition-transform duration-300 text-center ">
                            ABOUT SHISHIR
                        </h1>
                <div className="flex justify-center mb-12 md:mb-20">
                    <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56">
                        <img 
                            src="/assets/logo.png"
                            alt="SHISHIR Logo"
                            className="w-full h-full object-contain animate-float drop-shadow-2xl"
                        />
                    </div>
                </div>

                <div className="space-y-16 md:space-y-24">
                    {/* About Section */}
                    <div className="flex flex-col items-center md:items-end max-w-4xl mx-auto md:ml-auto">
                       
                        <p className="text-[#ffd960] text-base md:text-lg lg:text-xl leading-relaxed text-center md:text-right font-light tracking-wide max-w-3xl">
                            Experience the enchanting allure of diversity at <span className="font-semibold">SHISHIR</span>, 
                            the Annual Cultural Fest of the National Institute of Technology, Meghalaya. 
                            Here, amidst the harmonious blend of nature and culture, you'll be transported 
                            to a realm where time stands still, allowing you to relive moments of pure magic.
                        </p>
                    </div>

                    {/* Theme Section */}
                    <div className="max-w-3xl mx-auto space-y-6">
                        <p className="text-[#ffd960] text-base md:text-lg lg:text-xl leading-relaxed font-light tracking-wide text-center md:text-left">
                            <span className="font-semibold">NIT Meghalaya</span> extends a warm welcome to all, 
                            as we prepare for Meghalaya's grandest cultural extravaganza. Join us in celebrating 
                            the rich tapestry of cultures, where every tradition converges on a single stage, 
                            amidst the crisp mountain air, promising to etch unforgettable memories in your heart.
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-24 h-24 md:w-32 md:h-32 bg-[#d4a200] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 md:w-32 md:h-32 bg-[#ffd960] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
    );
}