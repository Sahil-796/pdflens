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

  // 1. Verify the Webhook Signature (Security)
  const wh = new Webhook(POLAR_WEBHOOK_SECRET);
  let event;
  try {
    event = wh.verify(payload, {
      "webhook-id": webhookId,
      "webhook-signature": signature,
      "webhook-timestamp": timestamp,
    }) as any; // Cast to 'any' since Polar types vary slightly
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // 2. Handle 'subscription.created' Event
  if (event.type === "subscription.created") {
    const subscription = event.data;

    // Polar payload usually puts email in 'customer' object or 'user' object
    const customerEmail =
      subscription.customer?.email || subscription.user?.email;

    if (customerEmail) {
      console.log(
        `[Polar Webhook] Upgrading user ${customerEmail} to Creator plan.`,
      );

      // Update the user in your database
      await db
        .update(user)
        .set({
          plan: "creator",
          creditsLeft: 100, // Instant upgrade
          polarSubscriptionId: subscription.id,
          polarCustomerId: subscription.customer_id,
        })
        .where(eq(user.email, customerEmail));
    } else {
      console.warn("[Polar Webhook] No email found in payload");
    }
  }

  return new Response("OK", { status: 200 });
}
