import Generate from '@/components/generatePage/Generate'
import TitleNav from '@/components/bars/title-nav'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <div className='h-screen flex flex-col'>
      <TitleNav text="Generate PDF" />
      <div className='flex-1 overflow-auto'>
        <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
          <Generate />
        </Suspense>
      </div>
    </div>
  )
}

export default Page
