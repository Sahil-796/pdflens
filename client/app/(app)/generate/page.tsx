import Generate from '@/components/Generate'
import TitleNav from '@/components/title-nav'
import React from 'react'

const page = () => {
  return (
    <div className='h-screen flex flex-col'>
      <TitleNav text="Generate PDF" />
      <div className='flex-1 overflow-hidden'>
        <Generate />
      </div>
    </div>
  )
}

export default page