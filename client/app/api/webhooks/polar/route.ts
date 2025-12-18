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

  const wh = new Webhook(POLAR_WEBHOOK_SECRET);
  let event;
  try {
    event = wh.verify(payload, {
      "webhook-id": webhookId,
      "webhook-signature": signature,
      "webhook-timestamp": timestamp,
    }) as any;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const subscription = event.data;
  const customerEmail =
    subscription.customer?.email || subscription.user?.email;

  if (!customerEmail) {
    console.warn(`[Polar Webhook] Skipped ${event.type}: No email found.`);
    return new Response("OK", { status: 200 });
  }

  try {
    switch (event.type) {
      case "subscription.created":
      case "subscription.active": // 'active' is sometimes sent after 'created' confirms payment
        console.log(`[Polar] Upgrading ${customerEmail} to Creator plan.`);
        await db
          .update(user)
          .set({
            plan: "creator",
            creditsLeft: 100,
            polarSubscriptionId: subscription.id,
            polarCustomerId: subscription.customer_id,
          })
          .where(eq(user.email, customerEmail));
        break;

      case "subscription.updated":
        // Only reset credits if the subscription is still active
        // This event fires on renewals (new period) or metadata changes
        if (subscription.status === "active") {
          console.log(
            `[Polar] Updating/Renewing ${customerEmail}. Resetting credits.`,
          );
          await db
            .update(user)
            .set({
              plan: "creator",
              creditsLeft: 100,
              polarSubscriptionId: subscription.id,
            })
            .where(eq(user.email, customerEmail));
        }
        break;

      case "subscription.canceled":
        // NOTE: We DO NOT downgrade here. They paid for the month.
        // We just log it. If you add a 'cancelAtPeriodEnd' column to your DB, update it here.
        console.log(
          `[Polar] User ${customerEmail} canceled. Access remains until end of period.`,
        );
        break;

      // 4. REVOCATION (Period ended or Payment Failed -> Downgrade)
      case "subscription.revoked":
        console.log(
          `[Polar] Subscription revoked for ${customerEmail}. Downgrading to Free.`,
        );
        await db
          .update(user)
          .set({
            plan: "free",
            polarSubscriptionId: null,
            creditsLeft: 20,
          })
          .where(eq(user.email, customerEmail));
        break;

      default:
        console.log(`[Polar] Unhandled event type: ${event.type}`);
    }
  } catch (dbError) {
    console.error(`[Polar] DB Error processing ${event.type}:`, dbError);
    return new Response("Database Error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
