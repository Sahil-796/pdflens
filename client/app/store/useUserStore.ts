import { create } from "zustand";

type UserState = {
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
    setUser: (data: Partial<UserState>)=>void;
    clearUser: ()=>void
};

export const useUserStore = create<UserState>(set => ({
    userId: null,
    userName: '',
    userEmail: "",
    setUser: data => set(state => ({...state, ...data})),
    clearUser: () => set({userId: null, userName: "", userEmail: ""})
}));