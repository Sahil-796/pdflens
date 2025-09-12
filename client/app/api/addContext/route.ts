import { NextResponse } from "next/server"

export async function POST(req: Request) {

    try {
        const formData = await req.formData();

        // Extract fields
        const file = formData.get("file") as File | null;
        const userId = formData.get("userId") as string | null;
        const pdfname = formData.get("pdfname") as string | null;

        if (!file || !userId || !pdfname) {
        return NextResponse.json({ error: "Missing file, userId, or name" }, { status: 400 });
        }

        // Build new FormData to send to Python server
        const forwardData = new FormData();
        forwardData.append("file", file); // File object goes directly
        forwardData.append("userId", userId);
        forwardData.append("pdfname", pdfname);

        // Forward to Python API
        const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: forwardData,
        });

        
        const result = await response.json();

        return NextResponse.json(result);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Proxy upload failed" }, { status: 500 });
  }
}