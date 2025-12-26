"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Coins,
  ArrowUpCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import CreditsTable from "./credits-table";
import Link from "next/link";

import { Subscription, Invoice } from "@/types/user";

const BillingTab = () => {
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [subData, setSubData] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const res = await fetch("/api/user/billing");
      const data = await res.json();

      if (data.hasSubscription) {
        setSubData(data.subscription);
        setInvoices(data.invoices);
      } else {
        setSubData(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load billing details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure? You will lose access to Creator features at the end of the billing period.",
      )
    )
      return;

    setCancelling(true);
    try {
      const res = await fetch("/api/user/billing", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");

      toast.success("Subscription canceled. Access remains until period end.");
      fetchBillingData(); // Refresh UI
    } catch (error) {
      toast.error("Could not cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // --- STATE 1: FREE PLAN ---
  if (!subData) {
    return (
      <div className="space-y-8">
        <Card className="border-border">
          <div className="h-2 w-full bg-muted" />
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Free Plan
                  <Badge variant="secondary">Active</Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upgrade to the Creator plan to unlock higher limits and
                  premium features.
                </p>
              </div>
              <Button
                onClick={() => router.push("/pricing")}
                className="shadow-lg shadow-primary/20"
              >
                <ArrowUpCircle className="w-4 h-4" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reuse your existing Credits Section */}
        <CreditSection user={user} />
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Usage History</h3>
          <CreditsTable />
        </div>
      </div>
    );
  }

  // --- STATE 2: ACTIVE SUBSCRIPTION ---
  const price = subData.product.prices[0];
  const renewalDate = new Date(subData.current_period_end).toLocaleDateString();
  const isCanceled = subData.cancel_at_period_end;

  return (
    <div className="space-y-8">
      {/* Active Subscription Card */}
      <Card className="border-primary/50 shadow-md overflow-hidden">
        <div className="h-2 w-full bg-primary" />
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Creator Plan</CardTitle>
              <CardDescription>
                Manage your subscription and payment details
              </CardDescription>
            </div>
            <Badge
              variant={isCanceled ? "destructive" : "default"}
              className="uppercase"
            >
              {isCanceled ? "Canceling" : "Active"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plan Cost */}
            <div className="p-4 bg-muted/30 rounded-lg border">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Current Plan
              </p>
              <p className="text-lg font-semibold">{subData.product.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(price.price_amount, price.price_currency)} /{" "}
                {price.recurring_interval}
              </p>
            </div>

            {/* Renewal Date */}
            <div className="p-4 bg-muted/30 rounded-lg border">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {isCanceled ? "Access Ends On" : "Next Payment"}
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-lg font-semibold">{renewalDate}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {isCanceled
                  ? "No further charges"
                  : "Auto-renews automatically"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-muted rounded">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Payment Method</p>
                <p className="text-xs text-muted-foreground">
                  Managed via Polar • {subData.customer.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {!isCanceled && (
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                onClick={handleCancelSubscription}
                disabled={cancelling}
              >
                {cancelling && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cancel Subscription
              </Button>
            )}
            {/* Redirect to pricing to switch plans if needed */}
            <Button variant="secondary" onClick={() => router.push("/pricing")}>
              Change Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Credit Section */}
      <CreditSection user={user} />

      {/* Invoice History Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Invoice History</h3>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      {new Date(inv.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(inv.amount, inv.currency)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {inv.status === "paid" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="capitalize text-sm">{inv.status}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-6"
                  >
                    No invoices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Usage History Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Usage History</h3>
        <CreditsTable />
      </div>
    </div>
  );
};

// Extracted Credit Section for cleaner code
const CreditSection = ({ user }: { user: any }) => (
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
            <p className="text-sm font-medium text-muted-foreground">Renewal</p>
            <p className="text-xl font-bold">Daily Reset</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default BillingTab;
