import { create } from "zustand"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"
type VerificationStatus = "unverified" | "verified"

type UserState = {
    userId: string | null
    userName: string | null
    userEmail: string | null
    userAvatar: string | null
    userPlan: 'free' | 'premium' | null
    emailVerified: boolean
    status: AuthStatus
    setUser: (data: Partial<UserState>) => void
    clearUser: () => void
    setStatus: (status: AuthStatus) => void
}

export const useUserStore = create<UserState>((set) => ({
    userId: null,
    userName: null,
    userEmail: null,
    userAvatar: null,
    userPlan: null,
    emailVerified: false,
    status: "loading",
    setUser: (data) => set((state) => ({ 
        ...state, 
        ...data, 
        status: "authenticated"
    })),
    clearUser: () =>
        set({
            userId: null,
            userName: null,
            userEmail: null,
            userAvatar: null,
            userPlan: null,
            emailVerified: false,
            status: "unauthenticated",
        }),
    setStatus: (status) => set({ status }),
}))