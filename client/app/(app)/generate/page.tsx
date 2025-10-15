import Generate from '@/components/generatePage/Generate'
import TitleNav from '@/components/bars/title-nav'
import React from 'react'

const page = () => {
  return (
    <div className='h-screen flex flex-col'>
      <TitleNav text="Generate PDF" />
      <div className='flex-1 overflow-auto'>
        <Generate />
      </div>
    </div>
  )
}

export default page