import { NextRequest, NextResponse } from "next/server";
import { RAZORPAY_PLANS } from "@/lib/stripe";
import { razorpay } from "@/lib/razorpay-server";
import {
  getUser,
  updateUserCredits,
  updateUserPlan,
} from "@/service/UserService";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get("order_id");
    const plan = searchParams.get("plan");
    const email = searchParams.get("email");

    if (!orderId || !plan || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const payment = await razorpay.payments.fetch(orderId);

    // Verify payment status
    if (payment.status !== "captured") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Get plan details
    const planDetails = RAZORPAY_PLANS[plan as keyof typeof RAZORPAY_PLANS];
    if (!planDetails) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Update user credits and plan
    const user = await getUser(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update credits
    const updatedUser = await updateUserCredits(
      email,
      user.credits + planDetails.credits
    );

    if (!updatedUser) {
      return NextResponse.redirect(
        new URL(
          `/pricing?error=true&message=failed-to-update-credits`,
          req.nextUrl.origin
        )
      );
    }

    // Update plan
    const finalUser = await updateUserPlan(email, plan as "PRO" | "PREMIUM");

    if (!finalUser) {
      return NextResponse.redirect(
        new URL(
          `/pricing?error=true&message=failed-to-update-plan`,
          req.nextUrl.origin
        )
      );
    }

    // Add credits and plan info to redirect URL
    return NextResponse.redirect(
      new URL(
        `/pricing?success=true&newCredits=${finalUser.credits}&newPlan=${finalUser.plan}`,
        req.nextUrl.origin
      )
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(
      new URL(`/pricing?error=true`, req.nextUrl.origin)
    );
  }
}
