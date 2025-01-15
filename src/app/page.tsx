import Navigation from '@/components/homepage/navigation'
import MainScene from '@/components/homepage/main-scene'
import HeadliningEvents from '@/components/homepage/head-events'
import About from '@/components/homepage/about'

export default function Home() {
  return (
    <main>
      <Navigation />
      <div className='home_contianer relative border-box overflow-hidden'>
        <MainScene />
        <HeadliningEvents />
        <About />
      </div>
      
    </main>
  )
}