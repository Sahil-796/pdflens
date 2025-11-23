import { db } from "./client";
import { user, credit_history } from "./schema";
import { eq, desc, sql } from "drizzle-orm";
import { formatInTimeZone } from "date-fns-tz";
import { v4 as uuidv4 } from "uuid";

const DAILY_ALLOWANCE = {
  free: 20,
  premium: 100,
};

const history = {
  "4": "AI pdf generation",
  "1": "Edit using AI",
  "-4": "Refund",
  "-1": "Refund"
}


export const deduceCredits = async (userId: string, cost: number) => {


    try {
        const result = await db.transaction(async (tx) => {

            const [currentUser] = await tx
                .select()
                .from(user)
                .where(eq(user.id, userId))
                .for("update");
                
            if (!currentUser) {
                throw new Error(`User not found with id: ${userId}`);
            }

            if (cost > 0) {
                const updated = await tx
                    .update(user)
                    .set({
                        creditsLeft: sql`${user.creditsLeft} - ${cost}`,
                    })
                    .where(sql`${user.id} = ${userId} AND ${user.creditsLeft} >= ${cost}`)
                    .returning({ creditsLeft: user.creditsLeft });

                if (updated.length === 0) {
                    throw new Error("Insufficient credits");
                }
                
                await tx.insert(credit_history).values({
                    id: uuidv4(),
                    userId,
                    amount: cost,
                    reason: history[cost] ?? "Unknown",
                });

                return updated[0].creditsLeft;
            }

            if (cost < 0) {
                 const updated = await tx
                    .update(user)
                    .set({ creditsLeft: sql`${user.creditsLeft} - ${cost}` }) 
                    .where(eq(user.id, userId))
                    .returning({ creditsLeft: user.creditsLeft });

                // Log refund history
                await tx.insert(credit_history).values({
                    id: uuidv4(),
                    userId,
                    amount: cost,
                    reason: history[cost] ?? "Unknown",
                });

                return updated[0].creditsLeft;
            }
            
            return currentUser.creditsLeft; 
        });

        return result;
    } catch (err) {
        throw new Error(`Failed to use credits: ${err.message}`);
    }
};

export const getCreditHistory = async (userId: string) => {
  const history = await db
    .select({
      amount: credit_history.amount,
      reason: credit_history.reason,
      created_at: credit_history.createdAt,
    })
    .from(credit_history)
    .where(eq(credit_history.userId, userId))
    .orderBy(desc(credit_history.createdAt));

  return history;
};

// db/credits.ts (New function)

export const ensureDailyAllowance = async (userId: string) => {
    try {
        const result = await db.transaction(async (tx) => {
            // 1. SELECT and LOCK the user row
            const [currentUser] = await tx
                .select()
                .from(user)
                .where(eq(user.id, userId))
                .for("update"); // Lock row to prevent race conditions during check/reset

            if (!currentUser) {
                throw new Error(`User not found with id: ${userId}`);
            }

            const todayUTC = formatInTimeZone(new Date(), "UTC", "yyyy-MM-dd");

            // 2. CHECK: Only proceed if a reset is needed
            if (currentUser.creditsResetAt < todayUTC) {
                // 3. RESET: Set credits to the full daily allowance
                const newCredits = DAILY_ALLOWANCE[currentUser.plan]; // Use full allowance, cost is 0

                const [updatedUser] = await tx
                    .update(user)
                    .set({ creditsLeft: newCredits, creditsResetAt: todayUTC })
                    .where(eq(user.id, userId))
                    .returning({ creditsLeft: user.creditsLeft });
                
                // Return the newly reset amount
                return updatedUser.creditsLeft;
            }

            // 4. NO RESET NEEDED: Return current credits without DB update
            return currentUser.creditsLeft;
        });

        return result;
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Failed to ensure daily allowance: ${err.message}`);
        }
        throw new Error("An unknown error occurred while trying to check/reset credits.");
    }
};