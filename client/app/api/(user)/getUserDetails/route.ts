import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db/client"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
    try {
        // Get session from auth
        const session = await auth.api.getSession({ headers: req.headers })

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get user details including verification status
        const [userDetails] = await db
            .select({
                plan: user.plan,
                emailVerified: user.emailVerified,
            })
            .from(user)
            .where(eq(user.id, session.user.id))
            .limit(1)

        if (!userDetails) {
            return NextResponse.json({ 
                plan: null,
                emailVerified: null,
                status: 'unauthenticated',
            })
        }

        return NextResponse.json({
            status: "authenticated",
            plan: userDetails.plan,
            emailVerified: userDetails.emailVerified,
        }, {status: 200})
    } catch (error: any) {
        console.error('Error fetching user details:', error)
        return NextResponse.json({ 
            status: "unauthenticated",
            error: "Internal server error",
            message: error.message 
        }, { 
            status: 500 
        })
    }
}


