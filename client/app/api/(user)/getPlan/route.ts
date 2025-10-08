import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db/client"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
    try {
        // Get session from auth (reads cookies via better-auth next plugin)
        const session = await auth.api.getSession({ headers: req.headers })

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
    } catch (error) {
        return NextResponse.json({ error: error.message || "Failed to fetch plan" }, { status: 500 })
    }
}


