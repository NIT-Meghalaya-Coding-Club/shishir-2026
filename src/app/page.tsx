import MainScene from '@/components/homepage/main-scene'
import About from '@/components/homepage/about'
import Events from '@/components/homepage/stats'
import CountdownTimer from '@/components/homepage/countdownTimer'
// import Sponsors from '@/components/homepage/sponsors'
// import ComingSoon from '@/components/ComingSoon'
// import Announcement from '@/components/homepage/announcement'
import FeaturedArtists from '@/components/homepage/featured-artists'
import { SakuraLanding } from '@/components/homepage/SakuraLanding'
import { Starfield } from '@/components/homepage/Starfield'

export default function Home() {
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