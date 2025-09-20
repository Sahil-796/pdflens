'use client'
import { usePdfStore } from '@/app/store/usePdfStore'
import TitleNav from '@/components/bars/title-nav'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const router = useRouter()
    const { pdfId } = usePdfStore()
    if (pdfId) {
        router.push(`/edit/${pdfId}`)
        return;
    }

    return (
        <div className='h-screen flex flex-col'>
            <TitleNav text="Edit PDF" />
            <div className='flex-1 overflow-hidden'>
                
            </div>
        </div>
    )
}

export default page