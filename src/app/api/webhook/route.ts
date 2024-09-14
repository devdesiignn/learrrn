import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { database } from "@/lib/database";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    console.log(["STRIPE WEBHOOK POST"], error);

    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userID = session.metadata?.userID;
  const courseID = session.metadata?.courseID;

  if (event.type !== "checkout.session.completed")
    return new NextResponse(`Webhook Error: Unhandled event type: ${event.type}`, { status: 200 });

  if (!userID || !courseID) return new NextResponse("Webhook Error: Missing metatdata", { status: 400 });

  await database.purchase.create({
    data: {
      courseID,
      userID,
    },
  });

  return new NextResponse(null, { status: 200 });
}
