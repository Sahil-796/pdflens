"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const router = useRouter();
  const { user } = useUser();

  console.log(user);

  const handlePlanSelect = (planName: string) => {
    if (!user) {
      router.push("/signup");
      return;
    }

    if (planName === "Creator") {
      if (user.isCreator) {
        toast.info("You are already on the Creator plan!");
        router.push("/account");
        return;
      }
      const checkoutUrl = `https://buy.polar.sh/polar_cl_RhPGRHIKwdN2Pj7SgelmbK6AR7RJtbl0bdCOy0JDpq9?customer_email=${encodeURIComponent(
        user.email,
      )}`;
      window.location.href = checkoutUrl;
      return;
    }
  };

  const tiers = [
    {
      name: "Free",
      id: "free",
      price: "$0",
      description: "Perfect for testing the waters and simple tasks.",
      features: [
        "20 AI credits per day",
        "Basic PDF generation",
        "Standard processing speed",
        "Community support",
      ],
      cta: user ? "Go to Dashboard" : "Get Started Free",
      popular: false,
    },
    {
      name: "Creator",
      id: "creator",
      price: "$3.99",
      description: "For power users who need professional results.",
      features: [
        "100 AI credits per day",
        "Priority processing (Skip the queue)",
        "Large file context uploads (10MB+)",
        "Advanced formatting options",
        // "No watermarks",
        "Direct email support",
      ],
      cta: user?.plan === "creator" ? "Manage Plan" : "Upgrade to Creator",
      popular: true,
    },
  ];

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-4 bg-background">
      {/* Background Decorator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-[30%] right-[10%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start for free, upgrade when you need more power. No hidden fees.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => {
            const isCreator = tier.id === "creator";
            const isCurrentPlan =
              (tier.id === "free" && user?.plan !== "creator") ||
              (tier.id === "creator" && user?.plan === "creator");

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={cn("h-full", isCreator && "md:-mt-4 md:mb-4")} // Lift the pro card slightly
              >
                <Card
                  className={cn(
                    "h-full flex flex-col relative transition-all duration-300",
                    isCreator
                      ? "border-primary/50 shadow-xl shadow-primary/10 bg-card/80 backdrop-blur-sm"
                      : "border-border bg-card/50 hover:bg-card/80",
                  )}
                >
                  {isCreator && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold">
                          {tier.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {tier.description}
                        </CardDescription>
                      </div>
                      {isCreator ? (
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                      ) : (
                        <div className="p-2 bg-muted rounded-lg">
                          <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      {tier.price !== "$0" && (
                        <span className="text-muted-foreground ml-2">
                          / month
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      {tier.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <div className="mt-1 p-0.5 rounded-full bg-primary/10 shrink-0">
                            <Check className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground leading-tight">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => handlePlanSelect(tier.name)}
                      variant={isCreator ? "default" : "outline"}
                      className={cn(
                        "w-full py-6 text-base font-medium transition-all cursor-pointer",
                        isCreator &&
                          "shadow-lg shadow-primary/25 hover:shadow-primary/40",
                      )}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? (
                        <>Current Plan</>
                      ) : (
                        <>
                          {tier.cta} <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Trust/Footer Text */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Secure payments processed by <strong>Polar</strong>. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
