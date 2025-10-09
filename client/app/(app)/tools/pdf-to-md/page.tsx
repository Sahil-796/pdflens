import TitleNav from '@/components/bars/title-nav'
import React from 'react'

const page = () => {
    return (
        <div className='h-screen flex flex-col'>
            <TitleNav text="PDF to MD" />
            <div className='flex-1 overflow-hidden p-4'>

            </div>
        </div>
    )
}

export default page