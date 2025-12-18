import { headers } from "next/headers";
import { Polar } from "@polar-sh/sdk";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
});

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user.polarSubscriptionId) {
    return NextResponse.json({
      hasSubscription: false,
      subscription: null,
      invoices: [],
    });
  }

  try {
    // 1. Fetch the specific subscription details
    const subscription = await polar.subscriptions.get({
      id: session.user.polarSubscriptionId,
    });

    // 2. Fetch recent orders (invoices) for this customer
    // We use the customer_id stored in your DB
    const ordersRequest = await polar.orders.list({
      customerId: session.user.polarCustomerId,
      limit: 5,
      sorting: ["-created_at"], // Newest first
    });

    return NextResponse.json({
      hasSubscription: true,
      subscription,
      invoices: ordersRequest.result.items,
    });
  } catch (error) {
    console.error("Polar Billing Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing data" },
      { status: 500 },
    );
  }
}

// Endpoint to cancel subscription
export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.polarSubscriptionId) {
    return NextResponse.json(
      { error: "No subscription found" },
      { status: 400 },
    );
  }

  try {
    await polar.subscriptions.update({
      id: session.user.polarSubscriptionId,
      subscriptionUpdate: {
        cancelAtPeriodEnd: true,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}
