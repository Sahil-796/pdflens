import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { user_id, user_prompt } = await req.json()
        console.log(user_id, user_prompt)
        const PYTHON_URL = process.env.PYTHON_URL || 'http://localhost:8000/ai/generate'

        const res = await fetch(PYTHON_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "any random key here"
            },
            body: JSON.stringify({
                user_id,
                user_prompt
            })
        })
        if (!res.ok) {
            return NextResponse.json({ error: "Python API failed" }, { status: res.status })
        }
        const data = await res.json()
        console.log(data)
        return NextResponse.json(data)
    } catch (err) {
        console.log("API Error:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}