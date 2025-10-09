import { db } from "./client"
import { user } from "./schema"
import { eq } from 'drizzle-orm';
import { formatInTimeZone } from 'date-fns-tz'

const DAILY_ALLOWANCE = {
    free: 20,
    premium: 50, 
};

export const deduceCredits = async (userId: string, cost: number) => {
    try {
        const result = await db.transaction(async (tx) => {
            const [currentUser] = await tx.select().from(user).where(eq(user.id, userId));

            if (!currentUser) {
                throw new Error(`User not found with id: ${userId}`);
            }

            const todayUTC = formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd');
            let currentCredits = currentUser.creditsLeft;

            // Check if a reset is needed
            if (currentUser.creditsResetAt < todayUTC) {
                currentCredits = DAILY_ALLOWANCE[currentUser.plan] - cost;
                const [updatedUser] = await tx.update(user)
                    .set({ creditsLeft: currentCredits, creditsResetAt: todayUTC })
                    .where(eq(user.id, userId))
                    .returning({ creditsLeft: user.creditsLeft })

                return updatedUser.creditsLeft
            }

            if (currentCredits < cost) {
                throw new Error("Insufficient credits"); 
            }

            const newCreditTotal = currentCredits - cost;
            const [updatedUser] = await tx.update(user)
                .set({ creditsLeft: newCreditTotal })
                .where(eq(user.id, userId))
                .returning({ creditsLeft: user.creditsLeft });
                

            return updatedUser.creditsLeft;
        });
        return result;

    } catch (err) {
        throw new Error(`Failed to use credits: ${err.message}`);
    }
}