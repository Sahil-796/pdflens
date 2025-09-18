import { useSession } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {

    const { data: session } = useSession()
    return (
        <div>page</div>
    )
}

export default page