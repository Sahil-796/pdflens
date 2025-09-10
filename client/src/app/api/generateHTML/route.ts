export async function generateHTML(input: string) {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
    const res = await fetch(`http://localhost:8000/ai/generate`, {
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