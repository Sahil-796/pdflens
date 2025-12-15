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
  pdfId: z.string().optional(), // Now optional
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
    // Use existing ID if provided, otherwise mint a new one
    const pdfId = parsed.data.pdfId || uuidv4();
    const isNewDocument = !parsed.data.pdfId;

    // 1. Deduct Credits
    let creditsLeft: number;
    try {
      creditsLeft = await deduceCredits(userId, 4);
      creditsDeducted = true;
    } catch (creditErr: any) {
      if (creditErr.message?.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 429 },
        );
      }
      throw creditErr;
    }

    // 2. Call AI
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
        pdfId, // Pass ID so AI knows where to find context
        isContext: isContext || false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Python API failed with status ${res.status}`);
    }

    const htmlContent = await res.json();
    if (!htmlContent || typeof htmlContent !== "string") {
      throw new Error("Invalid content from AI");
    }

    // 3. Handle Persistence
    // If this came from the Dashboard (no existing ID), we MUST save it to create the record.
    // If this came from the Editor (existing ID), we generally return HTML and let the client save.
    if (isNewDocument) {
      await createPdf(pdfId, userId, fileName || "Untitled", htmlContent);
    }

    return NextResponse.json({
      success: true,
      data: htmlContent,
      pdfId,
      fileName,
      creditsLeft,
      status: 200,
    });
  } catch (err: any) {
    console.error("[Generate] Error:", err);
    // Refund credits on failure
    if (userId && creditsDeducted) {
      try {
        await deduceCredits(userId, -4);
      } catch (refundErr) {
        console.error("Failed to refund credits:", refundErr);
      }
    }
    return NextResponse.json(
      { success: false, message: err.message || "Internal Error" },
      { status: 500 },
    );
  }
}
