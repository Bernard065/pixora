import Features from '@/modules/features'
import Hero from '@/modules/hero'
import Pricing from '@/modules/pricing'
import React from 'react'

const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      <Pricing />
    </div>
  )
}

export default Home