import { db } from "./client"
import { user, credit_history } from "./schema"
import { eq, desc } from 'drizzle-orm';
import { formatInTimeZone } from 'date-fns-tz'

const DAILY_ALLOWANCE = {
    free: 20,
    premium: 100, 
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

export const getCreditHistory = async (userId: string) => {
    const history = await db.select({amount: credit_history.amount, reason: credit_history.reason, created_at: credit_history.createdAt})
          .from(credit_history)
          .where(eq(credit_history.userId, userId))
          .orderBy(desc(credit_history.createdAt))

    return history
}