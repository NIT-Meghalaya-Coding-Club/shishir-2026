import About from '@/components/homepage/about'
import Events from '@/components/homepage/stats'
import CountdownTimer from '@/components/homepage/countdownTimer'
// import Sponsors from '@/components/homepage/sponsors'
// import ComingSoon from '@/components/ComingSoon'
// import Announcement from '@/components/homepage/announcement'
import FeaturedArtists from '@/components/homepage/featured-artists'
import { SakuraLanding } from '@/components/homepage/SakuraLanding'
import { Starfield } from '@/components/homepage/Starfield'
import ComingSoon from '@/components/ComingSoon'

export default function Home() {

  if (process.env.NEXT_PUBLIC_LAUNCH) {
    return (
      <ComingSoon />
    )
  }
  return (
    <main>
      <div className='home_contianer relative border-box overflow-hidden'>
        {/* <ComingSoon /> */}
        {/* <MainScene /> */}
        <SakuraLanding/>
        {/* <Tbutton /> */}
        {/* <HeadliningEvents /> */}

        <CountdownTimer />
        <About />
        <FeaturedArtists />
        <Starfield/>
        {/* <Sponsors /> */}
        {/* <Announcement /> */}
        <Events />
      </div>
      
    </main>
  )
}