import Navigation from '@/components/navigation'
import MainScene from '@/components/main-scene'
import HeadliningEvents from '@/components/head-events'

export default function Home() {
  return (
    <main>
      <Navigation />
      <div className='home_contianer relative border-box overflow-hidden'>
        <MainScene />
        <HeadliningEvents />
      </div>
      
    </main>
  )
}