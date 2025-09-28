import { db } from "./client"
import { user, pdf } from "./schema"
import { eq } from 'drizzle-orm';



export const getUser = async (id: string) => {
    try {
        const [newUser] = await db.select().from(user).where(eq(user.id, id))
        const pdfs = await db.select().from(pdf).where(eq(pdf.userId, user.id))
        return {newUser, pdfs}
    } catch (err) {
        throw new Error(`Failed to get user : ${err}`)
    }
}

