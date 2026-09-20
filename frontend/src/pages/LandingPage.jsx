import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/hero'
import HowItWorks from '../components/HowItWorks'
import Impact from '../components/Impact'
import Pricing from './Pricing'
import ChooseCharity from '../components/ChooseCharity'

const LandingPage = () => {
  return (
    <div>

        <div>
            <Navbar/>
            <Hero/>
            <HowItWorks/>
            <ChooseCharity/>
            <Pricing/>
            <Impact/>
            

        </div>


    </div>
  )
}

export default LandingPage