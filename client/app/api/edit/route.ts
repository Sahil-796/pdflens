import { deduceCredits } from "@/db/credits";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const EditHtmlSchema = z.object({
  userPrompt: z.string().min(1),
  html: z.string().min(1),
  pdfId: z.string().min(1),
  isContext: z.boolean().optional(),
});

export async function POST(req: Request) {
  let userId: string | undefined;
  let creditsDeducted = false;

  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = session.user.id;

    const body = await req.json();
    const parsed = EditHtmlSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { userPrompt, html, pdfId, isContext } = parsed.data;

    console.log(`[EditHTML] Deducting 1 credit for user ${userId}`);
    let creditsLeft: number;

    try {
      creditsLeft = await deduceCredits(userId, 1);
      creditsDeducted = true;
    } catch (creditErr: any) {
      if (creditErr.message.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 429 },
        );
      }
      throw creditErr;
    }

    console.log(`[EditHTML] Calling Python API for PDF ${pdfId}`);
    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";

    const res = await fetch(`${PYTHON_URL}/ai/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        secret1: process.env.secret as string,
      },
      body: JSON.stringify({
        userId,
        userPrompt,
        html,
        pdfId,
        isContext: isContext || false,
      }),
    });

    if (!res.ok) {
      const errorText = await res
        .text()
        .catch(() => "Unknown Python API Error");
      throw new Error(`Python API failed: ${errorText}`);
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data: data,
      creditsLeft,
      status: 200,
    });
  } catch (err: any) {
    console.error("[EditHTML] Error:", err);

    if (userId && creditsDeducted) {
      try {
        console.log(`[EditHTML] Refunding 1 credit for user ${userId}`);
        await deduceCredits(userId, -1);
      } catch (refundErr) {
        console.error("CRITICAL: Failed to refund edit credit:", refundErr);
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
