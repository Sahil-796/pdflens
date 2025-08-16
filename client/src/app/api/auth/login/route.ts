import { NextResponse } from "next/server"
import { createUser, getUser } from "@/db/users"
import { supabase } from "@/lib/auth"

export async function POST(req: Request) {

    
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback}`
            }
          }
        )

        if(error) {
            return NextResponse.json(
                { error: error.message }, 
                { status:500 }
            )
        }

        return NextResponse.redirect(data.url)
        

    
}