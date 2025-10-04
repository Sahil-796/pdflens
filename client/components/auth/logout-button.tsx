'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Loader2, LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useSidebar } from '../ui/sidebar'
import { useUserStore } from '@/app/store/useUserStore'

const LogoutButton = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { clearUser } = useUserStore()

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await authClient.signOut()
            clearUser()
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
            className="w-full flex items-center mt-2 gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
        >
            {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <LogOut className="size-4" />
            )}

            <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
        </Button>
    )
}

export default LogoutButton