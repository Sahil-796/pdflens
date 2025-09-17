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
            message: "Signed in successfully."
        }
    } catch (err) {
        const e = err as Error
        return {
            success: false,
            message: e.message || 'An unknown error occured'
        }
    }
}

export const signUp = async (name: string, email: string, password: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            }
        })
        return {
            success: true,
            message: "Signed up successfully."
        }
    } catch (err) {
        const e = err as Error
        return {
            success: false,
            message: e.message || 'An unknown error occured'
        }
    }
}