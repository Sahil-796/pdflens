"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  FileText,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import useUser from "@/hooks/useUser";

const SuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const polarSessionToken = searchParams.get("customer_session_token");
  const isPaymentVerified = !!polarSessionToken;

  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    if (!isPaymentVerified) {
      router.replace("/account");
    }
  }, [isPaymentVerified, router]);

  useEffect(() => {
    if (isPaymentVerified && user?.plan === "free" && !isTimeout) {
      const interval = setInterval(() => {
        authClient.getSession({
          forceRefresh: true,
        });
      }, 2000);

      const timeout = setTimeout(() => {
        setIsTimeout(true);
        clearInterval(interval);
      }, 15000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isPaymentVerified, user?.plan, isTimeout]);

  // 4. Auto-redirect to generator once success is confirmed
  useEffect(() => {
    if (user?.plan === "creator") {
      const timer = setTimeout(() => {
        router.push("/generate");
      }, 10000); // Give them 10s to see the confetti
      return () => clearTimeout(timer);
    }
  }, [user?.plan, router]);

  // --- RENDER STATES ---

  if (!isPaymentVerified) return null;

  // STATE: Verifying (Webhook hasn't hit DB yet)
  if (user?.plan === "free" && !isTimeout) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="p-8 text-center space-y-4 max-w-sm w-full border-border/50">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Confirming Upgrade...</h2>
            <p className="text-muted-foreground text-sm mt-2">
              We are finalizing your subscription. This usually takes a few
              seconds.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // STATE: Timeout (Webhook failed or took too long)
  if (user?.plan === "free" && isTimeout) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="p-8 text-center space-y-4 max-w-sm w-full border-red-500/20 bg-red-500/5">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-600">
              Verification Delayed
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Your payment was successful, but your account update is delayed.
            </p>
          </div>
          <div className="flex gap-2 justify-center mt-4">
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // STATE: SUCCESS (User is now 'creator')
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
                <Check className="w-8 h-8 text-white stroke-[3]" />
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

          <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
            <ul className="space-y-3 text-sm text-left">
              <li className="flex items-center gap-3">
                <div className="p-1 bg-yellow-500/10 rounded">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <span>
                  <strong>100 Credits</strong> added to balance
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 bg-blue-500/10 rounded">
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
                <span>Large file uploads unlocked</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/generate">
                Start Creating <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

// Wrap in Suspense for Next.js build safety
const SuccessPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;
