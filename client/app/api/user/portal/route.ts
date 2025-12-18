import { headers } from "next/headers";
import { Polar } from "@polar-sh/sdk";
import { auth } from "@/lib/auth";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user.polarCustomerId) {
    return new Response("No subscription found", { status: 400 });
  }

  try {
    // Create a portal session
    const result = await polar.customerSessions.create({
      customerId: session.user.polarCustomerId,
    });

    // Valid redirect URL to Polar's hosted portal
    const portalUrl = `https://polar.sh/zendrapdf/portal/usage?customer_session_token=${result.token}`;

    return new Response(JSON.stringify({ url: portalUrl }), { status: 200 });
  } catch (error) {
    console.error("Polar Portal Error:", error);
    return new Response("Failed to generate portal link", { status: 500 });
  }
}
