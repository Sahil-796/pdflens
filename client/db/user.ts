import { eq } from "drizzle-orm";
import { db } from "./client";
import { user } from "./schema";

export const updateUser = async (id: string, name: string) => {
    try {
        const [updatedUser] = await db
            .update(user)
            .set({
                name,
                updatedAt: new Date(),
            })
            .where(eq(user.id, id))
            .returning();

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    } catch (err) {
        console.error('Update user error:', err);
        throw new Error(`Failed to update user: ${(err as Error).message}`);
    }
}

export const deleteUser = async (id: string) => {
    try {
        const [deletedUser] = await db
            .delete(user)
            .where(eq(user.id, id))
            .returning();

        if (!deletedUser) {
            throw new Error('User not found');
        }

        return deletedUser;
    } catch (err) {
        console.error('Delete user error:', err);
        throw new Error(`Failed to delete user: ${(err as Error).message}`);
    }
}
