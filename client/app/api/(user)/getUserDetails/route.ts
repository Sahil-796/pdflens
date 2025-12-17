import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { ensureDailyAllowance } from "@/db/credits";
import { account, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await ensureDailyAllowance(userId);

    const [data] = await db
      .select({
        plan: user.plan,
        emailVerified: user.emailVerified,
        creditsLeft: user.creditsLeft,
        providerId: account.providerId,
      })
      .from(user)
      .leftJoin(account, eq(account.userId, user.id))
      .where(eq(user.id, userId))
      .limit(1);

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        plan: data.plan,
        emailVerified: data.emailVerified,
        creditsLeft: data.creditsLeft,
        providerId: data.providerId ?? "",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        // message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
