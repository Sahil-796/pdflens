import { getCreditHistory } from "@/db/credits"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"


export async function GET(req: Request) {
    try {

        const session = await auth.api.getSession({ headers: req.headers })
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const history = await getCreditHistory(session.user.id)

    return NextResponse.json(history, {status:200})
    }

    catch (error) {
            console.error('Error fetching user details:', error)


            return NextResponse.json({ 
                message: error.message ?? "Internal server error",
            }, {status: error.status ?? 500})
    }
}