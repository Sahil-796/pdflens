import { create } from "zustand"

type UserState = {
    userId: string | null
    userName: string | null
    userEmail: string | null
    userAvatar: string | null
    userPlan: 'free' | 'premium' | null
    emailVerified: boolean
    setUser: (data: Partial<UserState>) => void
    clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
    userId: null,
    userName: null,
    userEmail: null,
    userAvatar: null,
    userPlan: null,
    emailVerified: false,
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
        }),
}))