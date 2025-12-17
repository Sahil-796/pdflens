import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { db } from "@/db/client";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

const POLAR_WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("webhook-signature");
  const timestamp = headerPayload.get("webhook-timestamp");
  const webhookId = headerPayload.get("webhook-id");

  if (!signature || !timestamp || !webhookId) {
    return new Response("Missing signature", { status: 400 });
  }

  // 1. Verify the webhook signature (Security)
  const wh = new Webhook(POLAR_WEBHOOK_SECRET);
  let event;
  try {
    event = wh.verify(payload, {
      "webhook-id": webhookId,
      "webhook-signature": signature,
      "webhook-timestamp": timestamp,
    }) as any; // Cast to any because Polar SDK types might be complex here
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  // 2. Handle the Event
  if (event.type === "subscription.created") {
    const subscription = event.data;
    const customerEmail = subscription.customer.email; // or subscription.user.email depending on Polar version

    if (customerEmail) {
      console.log(`Upgrading user ${customerEmail} to Creator plan...`);

      // 3. Update the User in DB
      await db
        .update(user)
        .set({
          plan: "creator",
          creditsLeft: 100, // Immediate 100 credits
          polarSubscriptionId: subscription.id,
          polarCustomerId: subscription.customer_id,
        })
        .where(eq(user.email, customerEmail));
    }
  }

  // Handle renewals if you want to reset credits every month
  if (event.type === "subscription.updated") {
    // Logic to check if this is a renewal and reset credits
  }

  return new Response("OK", { status: 200 });
}
