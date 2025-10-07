import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db/client"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
    try {
        // Get session from auth (reads cookies via better-auth next plugin)
        // @ts-ignore - api surface from better-auth
        const { data: session } = await auth.api.getSession({ headers: request.headers })

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const rows = await db
            .select({ plan: user.plan })
            .from(user)
            .where(eq(user.id, session.user.id))
            .limit(1)

        if (rows.length === 0) {
            return NextResponse.json({ plan: null }, { status: 200 })
        }

        return NextResponse.json({ plan: rows[0].plan }, { status: 200 })
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 })
    }
}


