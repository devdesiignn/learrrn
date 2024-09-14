import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { database } from "@/lib/database";
import { stripe } from "@/lib/stripe";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: { courseID: string };
  }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses[0].emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await database.course.findUnique({
      where: {
        id: params.courseID,
        isPublished: true,
      },
    });

    const purchase = await database.purchase.findUnique({
      where: {
        userID_courseID: {
          userID: user.id,
          courseID: params.courseID,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await database.stripeCustomer.findUnique({
      where: {
        userID: user.id,
      },

      select: {
        stripeCustomerID: true,
      },
    });

    if (!stripeCustomer) {
      const newCustomer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await database.stripeCustomer.create({
        data: {
          userID: user.id,
          stripeCustomerID: newCustomer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerID,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?cancelled=1`,
      metadata: {
        courseID: course.id,
        userID: user.id,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.log("[STRIPE_CHECKOUT_POST]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
