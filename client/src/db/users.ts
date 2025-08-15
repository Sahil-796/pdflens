import { db } from "./client"
import { users } from "./schema"
import { eq, lt, gte, ne } from 'drizzle-orm';

export const createUser = async (fullName: string) => {

    try {
    const [newUser] = await db.insert(users).values({fullName}).returning()
    return newUser
    } catch (err) {
         throw new Error(`Failed to create user : ${err}`)
    }

}

export const getUser = async (id: number) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, id))
        return user
    } catch (err) {
        throw new Error(`Failed to get user : ${err}`)
    }
}

