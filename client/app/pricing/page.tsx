import Navbar from '@/components/bars/LandingNavbar'
import Pricing from '@/components/PricingPage/Pricing'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex-1 mt-16">
        <Pricing />
      </div>
    </div>
  )
}

export default page
