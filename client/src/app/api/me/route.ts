import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { getUser } from "@/db/users"


export async function GET() {

    //getting tokens
    // const access_token = (await cookies()).get("sb-access-token")?.value

    // if (!access_token) return NextResponse.json({ user : null }, { status: 401})
    
    // //fetching user from auth.users (supabase auth table) using getUser -_- fuck this 4 times.
    // // const supabase = await createClient()
    // // const { data: { user }, error } = await supabase.auth.getUser(access_token)

    // if (error || !user) return NextResponse.json({user:null}, {status:401})

    // // fetching app data using drizzle queries
    // const appUser = await getUser(user.id)

    // return NextResponse.json( { user: appUser })

}