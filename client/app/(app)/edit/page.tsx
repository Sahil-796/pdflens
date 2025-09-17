import { useSession } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {

    const { data: session } = useSession()
    if (!session) redirect('/')
    return (
        <div>page</div>
    )
}

export default page