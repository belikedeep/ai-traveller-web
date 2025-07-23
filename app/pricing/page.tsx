"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, Suspense, type ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { RAZORPAY_PLANS } from "@/lib/stripe";
import { Loader2 } from "lucide-react";
import { PLAN_LIMITS } from "@/service/UserService";

const PRICING_PLANS = [
  {
    name: "PRO",
    credits: RAZORPAY_PLANS.PRO.credits,
    price: `$${RAZORPAY_PLANS.PRO.price / 100}`,
    features: [
      "Plan trips up to 15 days",
      "15 AI Trip Itineraries",
      "All Destinations",
      "Priority Support",
      "Public Trip Sharing",
      "Share with Anyone (No Sign-in Required)",
    ],
    popular: true,
  },
  {
    name: "PREMIUM",
    credits: RAZORPAY_PLANS.PREMIUM.credits,
    price: `$${RAZORPAY_PLANS.PREMIUM.price / 100}`,
    features: [
      "Everything from Pro",
      "Plan trips up to 15 days",
      "50 AI Trip Itineraries",
      "All Destinations",
      "24/7 Priority Support",
      "Priority Queue",
      "Unlimited Public Sharing",
    ],
  },
];

function PricingPageContent(): ReactNode {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    picture: string;
    credits?: number;
    plan?: "FREE" | "PRO" | "PREMIUM";
  } | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    const initUser = () => {
      const user = localStorage.getItem("user");
      if (user) {
        setUserData(JSON.parse(user));
      } else {
        window.location.href = "/";
      }
    };

    loadRazorpayScript().then(initUser);
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const handlePaymentStatus = async () => {
      const success = searchParams.get("success");
      const error = searchParams.get("error");

      if (!success && !error) return;

      if (success === "true") {
        const newCredits = searchParams.get("newCredits");
        const newPlan = searchParams.get("newPlan") as "PRO" | "PREMIUM" | null;
        if (newCredits && newPlan && userData && isSubscribed) {
          const credits = parseInt(newCredits);
          const updatedUserData = {
            ...userData,
            credits,
            plan: newPlan as "PRO" | "PREMIUM",
          };
          localStorage.setItem("user", JSON.stringify(updatedUserData));
          setUserData(updatedUserData);

          toast({
            title: "Payment Successful! 🎉",
            description: `Your account has been upgraded to ${newPlan} plan with ${newCredits} credits. You can now plan trips up to ${
              PLAN_LIMITS[newPlan as keyof typeof PLAN_LIMITS]
            } days!`,
          });
        }
      } else if (error === "true") {
        const errorMessage = searchParams.get("message");
        toast({
          title: "Payment Failed",
          description:
            errorMessage || "There was an error processing your payment.",
          variant: "destructive",
        });
      }

      if (isSubscribed) {
        window.history.replaceState({}, "", "/pricing");
      }
    };

    handlePaymentStatus();

    return () => {
      isSubscribed = false;
    };
  }, [searchParams, toast, userData]);

  const handlePurchase = async (planName: string) => {
    if (!userData) return;

    setLoading(true);
    setSelectedPlan(planName);
    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planName,
          userEmail: userData.email,
        }),
      });

      const { orderId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: RAZORPAY_PLANS[planName as keyof typeof RAZORPAY_PLANS].price,
        currency:
          RAZORPAY_PLANS[planName as keyof typeof RAZORPAY_PLANS].currency,
        name: "AI Trip Planner",
        description: `${planName} Credits Package`,
        order_id: orderId,
        handler: function (response: RazorpayResponse) {
          window.location.href = `/api/stripe/success?order_id=${response.razorpay_payment_id}&plan=${planName}&email=${userData.email}`;
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to purchase credits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Unlock the full potential of AI-powered travel planning with our
          flexible pricing options
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative overflow-hidden rounded-2xl border border-border/50 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
              plan.popular
                ? "bg-gradient-to-b from-primary/10 via-background to-background ring-2 ring-primary"
                : "bg-background/50"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              </div>
            )}
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-bold">{plan.price}</p>
                  <span className="text-muted-foreground">/one-time</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  {plan.credits} Credits
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              {userData ? (
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
                  disabled={loading}
                  onClick={() => handlePurchase(plan.name)}
                  size="lg"
                >
                  {loading && selectedPlan === plan.name ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Get ${plan.credits} Credits`
                  )}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant="outline"
                  size="lg"
                  onClick={() => setOpenDialog(true)}
                >
                  Sign in to Purchase
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          All plans include access to our AI travel planning features. Credits
          never expire. Need a custom plan?{" "}
          <button className="text-primary hover:text-primary/90 hover:underline">
            Contact us
          </button>
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">Loading pricing plans...</p>
        </div>
      }
    >
      <PricingPageContent />
    </Suspense>
  );
}
