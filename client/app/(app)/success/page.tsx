"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";

const SuccessPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const isCreator = user.isCreator;
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/generate");
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl p-8 text-center space-y-6">
          {/* Animated Success Icon */}
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
              Welcome to the Creator Plan. Your account has been upgraded and
              your credits have been replenished.
            </p>
          </div>

          {/* Value Recap */}
          <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
            <ul className="space-y-3 text-sm text-left">
              <li className="flex items-center gap-3">
                <div className="p-1 bg-yellow-500/10 rounded">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <span>
                  <strong>100 Credits</strong> added to your balance
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

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              asChild
              size="lg"
              className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              <Link href="/generate">
                Start Creating <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
