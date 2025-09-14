"use server"

import { auth } from "@/lib/auth";

export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })
        return {
            success: true,
            messsage: "Signed in successfully."
        }
    } catch (err) {
        const e = err as Error
        return {
            success: false,
            message: e.message || 'An unknown error occured'
        }
    }
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