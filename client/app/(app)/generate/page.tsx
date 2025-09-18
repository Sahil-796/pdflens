import Generate from '@/components/Generate'
import TitleNav from '@/components/title-nav'
import { useSession } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {
  const { data: session } = useSession()
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