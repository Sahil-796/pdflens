import AccountSettings from '@/components/AccountSettings'
import TitleNav from '@/components/bars/title-nav'
import React from 'react'

const Page = () => {
    return (
        <div className='h-screen flex flex-col'>
            <TitleNav text="Account Settings" />
            <div className='flex-1 overflow-auto'>
                <AccountSettings />
            </div>
        </div>
    )
}

export default Page