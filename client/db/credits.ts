import { db } from "./client";
import { user, credit_history } from "./schema";
import { eq, desc } from "drizzle-orm";
import { formatInTimeZone } from "date-fns-tz";
import { v4 as uuidv4 } from "uuid";

const DAILY_ALLOWANCE = {
  free: 20,
  premium: 100,
};

const history = {
 4: "AI pdf generation",
 1: "Edit using AI",
}

export const deduceCredits = async (userId: string, cost: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const [currentUser] = await tx
        .select()
        .from(user)
        .where(eq(user.id, userId));

      if (!currentUser) {
        throw new Error(`User not found with id: ${userId}`);
      }

      const todayUTC = formatInTimeZone(new Date(), "UTC", "yyyy-MM-dd");
      let currentCredits = currentUser.creditsLeft;
console.log(typeof(tx))



      // Check if a reset is needed
      if (currentUser.creditsResetAt < todayUTC) {
        currentCredits = DAILY_ALLOWANCE[currentUser.plan] - cost;
        
        //add credit history 
        
        if (cost !== 0) {
          await tx.insert(credit_history).values({
            id: uuidv4(),
            userId,
            amount: cost,
            reason: history[cost],
          });
        }
        
        const [updatedUser] = await tx
          .update(user)
          .set({ creditsLeft: currentCredits, creditsResetAt: todayUTC })
          .where(eq(user.id, userId))
          .returning({ creditsLeft: user.creditsLeft });

        return updatedUser.creditsLeft;
      }

      if (currentCredits < cost) {
        throw new Error("Insufficient credits");
      }

      // no reset needed
      const newCreditTotal = currentCredits - cost;
      
      //add credit history 

      if (cost !== 0) {
        await tx.insert(credit_history).values({
          id: uuidv4(),
          userId,
          amount: cost,
          reason: history[cost],
        });
      }
      
      const [updatedUser] = await tx
        .update(user)
        .set({ creditsLeft: newCreditTotal })
        .where(eq(user.id, userId))
        .returning({ creditsLeft: user.creditsLeft });

      return updatedUser.creditsLeft;
    });

    return result;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to use credits: ${err.message}`);
    }
    throw new Error("An unknown error occurred while trying to use credits.");
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

