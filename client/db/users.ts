import { db } from "./client"
import { users } from "./schema"
import { eq, lt, gte, ne } from 'drizzle-orm';

export const createUser = async (id: string, fullName: string, email: string) => {

    try {
        console.log("runniing createUser")
    const [newUser] = await db.insert(users).values({id, fullName, email}).returning()
    return newUser
    } catch (err) {
         throw new Error(`Failed to create user : ${err}`)
    }

}

export const getUser = async (id: string) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, id))
        return user
    } catch (err) {
        throw new Error(`Failed to get user : ${err}`)
    }
}

