export async function generateHTML(input: string) {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/ai/generate'
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: "sahil7",
            user_prompt: input
        })
    })
    let data = await res.json()
    return data
}