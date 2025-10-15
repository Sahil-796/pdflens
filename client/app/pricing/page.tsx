import LandingNavbar from '@/components/bars/LandingNavbar'
import Pricing from '@/components/PricingPage/Pricing'
import React from 'react'

const page = () => {
    return (
        <div className="h-screen flex flex-col">
            <LandingNavbar />
            <div className="flex-1 overflow-y-auto md:overflow-hidden mt-16 xl:mt-12">
                <Pricing />
            </div>
        </div>
    )
}

export default page