import MainScene from '@/components/homepage/main-scene'
import About from '@/components/homepage/about'
import Events from '@/components/homepage/stats'
import CountdownTimer from '@/components/homepage/countdownTimer'
// import ComingSoon from '@/components/ComingSoon'

export default function Home() {
  return (
    <main>
      <div className='home_contianer relative border-box overflow-hidden'>
        {/* <ComingSoon /> */}
        <MainScene />
        {/* <HeadliningEvents /> */}
        <CountdownTimer />
        <About />
        <Events />
      </div>
      
    </main>
  )
}