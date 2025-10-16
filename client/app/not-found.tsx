import Navbar from '@/components/bars/LandingNavbar'
import { NotFound } from '@/components/ui/ghost-404-page'
import React from 'react'

const NotFoundPage = () => {
  return (
    <div className="h-screen w-full bg-background">
      <Navbar />
      <NotFound />
    </div>
  )
}

export default NotFoundPage
