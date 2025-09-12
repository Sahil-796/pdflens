import { use } from "react";
import { db } from "./client"
import { users, pdf } from "./schema"
import { eq, lt, gte, ne } from 'drizzle-orm';

export const createUser = async (id: string, fullName: string, email: string) => {

    try {
    console.log("running createUser")
    const [newUser] = await db.insert(users).values({id, fullName, email}).returning()
    return newUser
    } catch (err) {
         throw new Error(`Failed to create user : ${err}`)
    }

}

export const getUser = async (id: string) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, id))
        const pdfs = await db.select().from(pdf).where(eq(pdf.userId, user.id))
        return {user, pdfs}
    } catch (err) {
        throw new Error(`Failed to get user : ${err}`)
    }
}

