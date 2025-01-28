import MainScene from '@/components/homepage/main-scene'
import HeadliningEvents from '@/components/homepage/head-events'
import About from '@/components/homepage/about'
import Events from '@/components/homepage/stats'

export default function Home() {
  return (
    <main>
      <div className='home_contianer relative border-box overflow-hidden'>
        <MainScene />
        {/* <HeadliningEvents /> */}
        <About />
        <Events />
      </div>
      
    </main>
  )
}