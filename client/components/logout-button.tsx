'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2, LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const LogoutButton = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await authClient.signOut()
            router.push('/')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
            {isLoading ? (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    Logging out...
                </>
            ) : (
                <>
                    <LogOut className="size-4" />
                    Logout
                </>
            )}
        </Button>
    )
}

export default LogoutButton