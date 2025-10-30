import { create } from "zustand"

type UserState = {
  userId: string | null
  userName: string | null
  userEmail: string | null
  userAvatar: string | null
  userPlan: 'free' | 'premium' | null
  emailVerified: boolean
  providerId: string
  creditsLeft: number
  setUser: (data: Partial<UserState>) => void
  clearUser: () => void
  fetched: boolean
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  userName: null,
  userEmail: null,
  userAvatar: null,
  userPlan: null,
  emailVerified: false,
  providerId: '',
  creditsLeft: 0,
  setUser: (data) => set((state) => ({
    ...state,
    ...data,
  })),
  clearUser: () =>
    set({
      userId: null,
      userName: null,
      userEmail: null,
      userAvatar: null,
      userPlan: null,
      emailVerified: false,
      providerId: '',
      creditsLeft: 0,
      fetched: false
    }),
  fetched: false
}))
