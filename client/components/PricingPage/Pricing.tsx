"use client";

import * as React from "react";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { PricingCard, type PricingTier } from "./pricing-card";
import { Tab } from "./pricing-tab";
import { toast } from "sonner";

export default function Pricing() {
  const router = useRouter();
  const { user } = useUser();
  const frequencies = ["monthly", "yearly"] as const;
  const [selectedFrequency, setSelectedFrequency] =
    React.useState<(typeof frequencies)[number]>("monthly");

  const handlePlanSelect = (planName: string) => {
    if (!user) {
      router.push("/signup");
      return;
    }

    if (planName === "Pro") {
      if (user?.isPro) {
        toast.info("You are already Pro.");
        router.push("/account");
        return;
      }
      router.push("/account/billing");
      return;
    }

    // If user is already authenticated and selecting free plan
    router.push("/dashboard");
  };

  const currentPlan = user?.isPro;

  const tiers: PricingTier[] = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "For getting started with AI PDF generation",
      features: [
        "20 credits per day",
        "AI PDF generation",
        "Edit and download PDFs",
        "Community support",
      ],
      cta: user ? "Access Dashboard" : "Get Started",
      highlighted: false,
      currentPlan: !currentPlan,
      onSelect: () => handlePlanSelect("Free"),
    },
    {
      name: "Pro",
      price: { monthly: 19, yearly: 180 },
      description: "For power users who need more",
      features: [
        "100 credits per day",
        "Faster AI generation",
        "Priority processing",
        "Upload context for better results",
        "Advanced formatting & styling",
        "Email support",
      ],
      cta: user?.plan === "premium" ? "You are already Pro" : "Upgrade to Pro",
      highlighted: true,
      currentPlan: currentPlan,
      onSelect: () => handlePlanSelect("Pro"),
    },
  ];

  return (
    <section className="flex items-start justify-center bg-background pt-8 md:pt-12 pb-12">
      <div className="w-full max-w-6xl px-4 sm:px-6">
        <div className="space-y-2 sm:space-y-3 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-foreground">
            Simple, transparent pricing
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Pick a plan that fits your usage. Upgrade anytime.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mx-auto mt-4 sm:mt-6 w-fit rounded-full bg-muted p-1 flex items-center gap-1">
          {frequencies.map((freq) => (
            <Tab
              key={freq}
              text={freq}
              selected={selectedFrequency === freq}
              setSelected={(v) =>
                setSelectedFrequency(v as (typeof frequencies)[number])
              }
              discount={freq === "yearly"}
            />
          ))}
        </div>

        {/* Cards */}
        <div className="grid w-full max-w-6xl mx-auto gap-4 sm:gap-6 mt-6 sm:mt-10 grid-cols-1 sm:grid-cols-2">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.name}
              tier={{
                ...tier,
                price:
                  tier.name === "Pro"
                    ? { monthly: 19, yearly: 15 } // display-friendly yearly per-month price
                    : tier.price,
              }}
              paymentFrequency={selectedFrequency}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
