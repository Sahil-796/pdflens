import { NextResponse } from "next/server"
import { createUser, getUser } from "@/db/users"
import { supabase } from "@/lib/auth"

export async function POST(req: Request) {

    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
          })
    }
}