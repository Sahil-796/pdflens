import { NextResponse } from "next/server"

export async function POST(req: Request){
    const { user_id, user_prompt } = await req.json()
    const PYTHON_URL = process.env.NEXT_PYTHON_URL || 'http://localhost:8000/ai/generate'

    const res = await fetch(PYTHON_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "any random key here"
        },
        body: JSON.stringify({
            user_id: user_id,
            user_prompt: user_prompt
        })
    })
    let data = await res.json()
    return NextResponse.json({data})
}