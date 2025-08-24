import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import {createUser, getUser } from "@/db/users"

export async function GET(request: Request) {

    try {
    //getting code from url
    const url = new URL(request.url)
    const code = url.searchParams.get("code")

    if (!code) return NextResponse.redirect(new URL("/", request.url))

    //this uses server side supabase client code. i.e supabaseAuthAdminRole

    const supabase = await createClient()
    const { data: {session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if(error || !session) {
        return NextResponse.redirect(new URL("/login"))
    }

    
    //setting drizzle user
    const { user } = session
    console.log("here", user)
    const existing = await getUser(user.id)
    if(!existing) {
        await createUser(user.id, user.user_metadata.full_name ?? "No Name", user.email ?? "") 
        console.log("ran createUser")
    }

    //setting cookies - fuck this 3 times.  

    
    const cookieStore = await cookies()
    
cookieStore.set("sb-access-token", session.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60*60
})
    cookieStore.set("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60*60*7*30
    })
    
    return NextResponse.redirect("/") 
} catch (err) {
    console.error(err)
}
}