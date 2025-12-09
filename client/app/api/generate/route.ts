import { deduceCredits } from "@/db/credits";
import { createPdf } from "@/db/pdfs";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const GenerateSchema = z.object({
  userPrompt: z.string().min(1),
  fileName: z.string().optional(),
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
    const parsed = GenerateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { userPrompt, fileName, isContext } = parsed.data;

    console.log(`[V2/Generate] Deducting credits for user ${userId}`);
    let creditsLeft: number;

    try {
      creditsLeft = await deduceCredits(userId, 4);
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

    const pdfId = uuidv4();

    console.log(`[V2/Generate] Calling Python API for PDF ${pdfId}`);
    const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";

    const res = await fetch(`${PYTHON_URL}/ai/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        secret1: process.env.secret as string,
      },
      body: JSON.stringify({
        userId,
        userPrompt,
        pdfId,
        isContext: isContext || false,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(
        errorBody.message || `Python API failed with status ${res.status}`,
      );
    }

    const data = await res.json();
    const htmlContent = data;

    if (
      !htmlContent ||
      typeof htmlContent !== "string" ||
      htmlContent.length === 0
    ) {
      throw new Error("Invalid or empty content received from AI");
    }

    console.log(`[V2/Generate] Creating PDF ${pdfId}`);
    await createPdf(pdfId, userId, fileName || "Untitled", htmlContent);

    return NextResponse.json({
      success: true,
      data: htmlContent,
      pdfId,
      fileName,
      creditsLeft,
      status: 200,
    });
  } catch (err: any) {
    console.error("[V2/Generate] Error:", err);

    if (userId && creditsDeducted) {
      try {
        console.log(`[V2/Generate] Refunding credits for user ${userId}`);
        await deduceCredits(userId, -4);
      } catch (refundErr) {
        console.error("CRITICAL: Failed to refund credits:", refundErr);
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
