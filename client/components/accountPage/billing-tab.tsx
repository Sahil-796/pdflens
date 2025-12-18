"use client";

import {
  CheckCircle2,
  Coins,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import CreditsTable from "./credits-table";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

const BillingTab = () => {
  const { user } = useUser();
  const router = useRouter();
  const [loadingPortal, setLoadingPortal] = useState(false);

  const handleManageSubscription = async () => {
    try {
      setLoadingPortal(true);
      const res = await fetch("/api/user/portal", { method: "POST" });

      if (!res.ok) throw new Error("Failed to load portal");

      const data = await res.json();
      // Redirect user to Polar
      window.location.href = data.url;
    } catch (error) {
      toast.error("Could not load billing portal");
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Plan Card */}
      <Card
        className={`overflow-hidden border ${user?.isCreator ? "border-primary/50 shadow-md" : "border-border"}`}
      >
        <div
          className={`h-2 w-full ${user?.isCreator ? "bg-primary" : "bg-muted"}`}
        />
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">
                  {user?.isCreator ? "Creator Plan" : "Free Plan"}
                </h3>
                {user?.isCreator && (
                  <Badge
                    variant="default"
                    className="bg-primary/10 text-primary hover:bg-primary/20 border-none"
                  >
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {user?.isCreator
                  ? "You have full access to all premium features."
                  : "Upgrade to unlock more credits and features."}
              </p>
            </div>

            {user?.isCreator ? (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={loadingPortal}
                className="gap-2"
              >
                {loadingPortal ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                Manage Subscription
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/pricing")}
                className="gap-2 shadow-lg shadow-primary/20"
              >
                <Sparkles className="w-4 h-4" />
                Upgrade Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credit Usage Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Credit Balance</h3>
          <Link
            href="/pricing"
            className="text-xs text-primary hover:underline font-medium"
          >
            Buy more credits
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-600">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Available Credits
                </p>
                <p className="text-2xl font-bold">{user?.creditsLeft}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Plan Renewal
                </p>
                <p className="text-xl font-bold">
                  {/* You can map user.creditsResetAt if available, or just say Daily/Monthly */}
                  Daily Reset
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Usage History</h3>
        <CreditsTable />
      </div>
    </div>
  );
};

export default BillingTab;
