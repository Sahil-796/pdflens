"use server"

import { auth } from "@/lib/auth";

export const signIn = async () => {
    await auth.api.signInEmail({
        body: {
            email: 'rudra@gmail.com',
            password: "Rfvbhu8768"
        }
    })
}

export const signUp = async () => {
    await auth.api.signUpEmail({
        body: {
            email: 'rudra@gmail.com',
            password: "Rfvbhu8768",
            name: "Rudra Patel"
        }
    })
}