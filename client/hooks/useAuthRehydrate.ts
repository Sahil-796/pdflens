"use client"

import { useUserStore } from "@/app/store/useUserStore"
import { authClient } from "@/lib/auth-client"
import { useEffect } from "react"
import { toast } from "sonner"

export function useAuthRehydrate() {
    const setUser = useUserStore((s) => s.setUser)
    const clearUser = useUserStore((s) => s.clearUser)
    const { data: session, isPending } = authClient.useSession()
    const user = session?.user

    useEffect(() => {
        if (isPending) return // still loading from auth

        try {
            if (user) {
                const { id, name, email, image } = user
                setUser({
                    userId: id,
                    userName: name ?? "",
                    userEmail: email ?? "",
                    userAvatar: image ?? null,
                })
            } else {
                clearUser()
            }
        } catch (err) {
            console.error(err)
            toast.error("Kindly log in again.")
            clearUser()
        }
    }, [user, isPending, setUser, clearUser])
}