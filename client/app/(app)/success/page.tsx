"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import useUser from "@/hooks/useUser";

const SuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const isPaymentParamPresent = searchParams.get("payment") === "success";

  // State to track if we gave up waiting for the webhook
  const [isTimeout, setIsTimeout] = useState(false);

  // 1. Redirect if no param
  useEffect(() => {
    if (!isPaymentParamPresent) {
      router.replace("/account");
    }
  }, [isPaymentParamPresent, router]);

  // 2. Poll for Session Updates if User is still "Free"
  useEffect(() => {
    if (isPaymentParamPresent && user?.plan === "free" && !isTimeout) {
      const interval = setInterval(() => {
        authClient.getSession({
          forceRefresh: true,
        });
      }, 2000); // Check every 2 seconds

      // Stop checking after 15 seconds to avoid infinite loops
      const timeout = setTimeout(() => {
        setIsTimeout(true);
        clearInterval(interval);
      }, 15000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isPaymentParamPresent, user?.plan, isTimeout]);

  // 3. Auto-forward to generate page after success (optional)
  useEffect(() => {
    if (user?.plan === "creator") {
      const timer = setTimeout(() => {
        router.push("/generate");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [user?.plan, router]);

  // --- RENDER STATES ---

  // State A: Invalid Access
  if (!isPaymentParamPresent) return null;

  // State B: Verifying (URL says success, but DB hasn't updated yet)
  if (user?.plan === "free" && !isTimeout) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="p-8 text-center space-y-4 max-w-sm w-full border-border/50">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Verifying Payment...</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Please wait while we confirm your transaction securely.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // State C: Timeout (Webhook took too long or user faked the URL)
  if (user?.plan === "free" && isTimeout) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="p-8 text-center space-y-4 max-w-sm w-full border-red-500/20 bg-red-500/5">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              We couldn't verify your upgrade yet. It might still be processing.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Check Again
          </Button>
        </Card>
      </div>
    );
  }

  // State D: SUCCESS (User is actually Creator)
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl p-8 text-center space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="absolute inset-0 bg-green-500/10 rounded-full flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <Check className="w-8 h-8 text-white stroke-3" />
              </div>
            </motion.div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground">
              Welcome to the Creator Plan. Your account has been upgraded.
            </p>
          </div>

          {/* ... (Rest of your Value Recap & Buttons) ... */}
          <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
            <ul className="space-y-3 text-sm text-left">
              <li className="flex items-center gap-3">
                <div className="p-1 bg-yellow-500/10 rounded">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <span>
                  <strong>100 Credits</strong> added
                </span>
              </li>
              {/* ... */}
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/generate">Start Creating</Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;
