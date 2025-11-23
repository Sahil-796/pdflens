import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db/client"
import { deduceCredits } from "@/db/credits"
import { account, user } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
    try {
        // Get session from auth
        const session = await auth.api.getSession({ headers: req.headers })

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await deduceCredits(session?.user?.id, 0)

        // Get user details including verification status
        const [userDetails] = await db
            .select({
                plan: user.plan,
                emailVerified: user.emailVerified,
                creditsLeft: user.creditsLeft,
            })
            .from(user)
            .where(eq(user.id, session.user.id))
            .limit(1)

        if (!userDetails) {
            return NextResponse.json({
                plan: null,
                emailVerified: null,
                creditsLeft: 0,
            })
        }

        const [userProvider] = await db
            .select({
                providerId: account.providerId
            })
            .from(account)
            .where(eq(account.userId, session.user.id))

        if (!userProvider) {
            return NextResponse.json({
                providerId: '',
            })
        }

        return NextResponse.json({
            plan: userDetails.plan,
            emailVerified: userDetails.emailVerified,
            creditsLeft: userDetails.creditsLeft,
            providerId: userProvider.providerId,
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching user details:', error)
        return NextResponse.json({
            error: "Internal server error",
            message: error.message
        }, {
            status: 500
        })
    }
}
