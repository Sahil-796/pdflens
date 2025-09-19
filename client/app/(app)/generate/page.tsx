import Generate from '@/components/generatePage/Generate'
import TitleNav from '@/components/bars/title-nav'
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