import { NextRequest, NextResponse } from "next/server";
import { RAZORPAY_PLANS } from "@/lib/stripe";
import { razorpay } from "@/lib/razorpay-server";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, userEmail } = body;

    if (!plan || !userEmail) {
      return NextResponse.json(
        { error: "Plan and user email are required" },
        { status: 400 }
      );
    }

    const planDetails = RAZORPAY_PLANS[plan as keyof typeof RAZORPAY_PLANS];
    if (!planDetails) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const options = {
      amount: planDetails.price,
      currency: planDetails.currency,
      receipt: nanoid(),
      payment_capture: 1,
      notes: {
        credits: planDetails.credits.toString(),
        userEmail,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Razorpay API Error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
