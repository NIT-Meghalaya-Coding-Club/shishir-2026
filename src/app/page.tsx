import MainScene from '@/components/homepage/main-scene'
import About from '@/components/homepage/about'
import Events from '@/components/homepage/stats'
import CountdownTimer from '@/components/homepage/countdownTimer'
import Sponsors from '@/components/homepage/sponsors'
// import ComingSoon from '@/components/ComingSoon'
// import Announcement from '@/components/homepage/announcement'
// import FeaturedArtists from '@/components/homepage/featured-artists'


export default function Home() {
  return (
    <main>
      <div className='home_contianer relative border-box overflow-hidden'>
        {/* <ComingSoon /> */}
        <MainScene />
        {/* <HeadliningEvents /> */}
        {/* <FeaturedArtists /> */}

        <CountdownTimer />
        <Sponsors />
        {/* <Announcement /> */}
        <About />
        <Events />
      </div>
      
    </main>
  )
}