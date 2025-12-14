"use client";

import { CreditCardIcon, Invoice02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceMonthly: number;
  features: string[];
}

interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  paymentType: string | null;
  createdAt: string;
}

interface SubscriptionData {
  id: string;
  status: string;
  currentPeriodEnd: string;
  plan: Plan;
  transactions: Transaction[];
}

export default function BillingPage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const orgId = activeOrg?.id;

  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await fetch("/api/billing/plans");
      if (!res.ok) throw new Error("Failed to fetch plans");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // Plans don't change often
  });

  const { data: subscriptionData } = useQuery<SubscriptionData | null>({
    queryKey: ["subscription", orgId],
    queryFn: async () => {
      const res = await fetch("/api/billing/subscription");
      if (!res.ok) return null;
      const data = await res.json();
      return data?.id ? data : null;
    },
    enabled: !!orgId,
  });

  const subscribeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
  });

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "success":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
      case "expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (!activeOrg) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Select an organization first.</p>
      </div>
    );
  }

  const subscription = subscriptionData;
  const transactions = subscriptionData?.transactions || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage subscription for {activeOrg.name}
        </p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <HugeiconsIcon
                icon={CreditCardIcon}
                strokeWidth={2}
                className="size-5"
              />
              Active Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold">{subscription.plan.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatIDR(subscription.plan.priceMonthly)}/mo
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Renews on: {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
              <Badge variant="default" className="bg-green-500">
                {subscription.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose a plan that fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const isCurrentPlan = subscription?.plan.id === plan.id;
              return (
                <Card
                  key={plan.id}
                  className={
                    isCurrentPlan ? "border-primary ring-1 ring-primary" : ""
                  }
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {isCurrentPlan && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-3xl font-bold">
                        {plan.priceMonthly === 0
                          ? "Free"
                          : formatIDR(plan.priceMonthly)}
                      </span>
                      {plan.priceMonthly > 0 && (
                        <span className="text-muted-foreground">/mo</span>
                      )}
                    </div>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, i) => (
                        <li
                          key={`feature-${plan.id}-${i}`}
                          className="flex items-center gap-2"
                        >
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={subscribeMutation.isPending || isCurrentPlan}
                      onClick={() => subscribeMutation.mutate(plan.id)}
                    >
                      {subscribeMutation.isPending &&
                      subscribeMutation.variables === plan.id
                        ? "Loading..."
                        : isCurrentPlan
                          ? "Current Plan"
                          : "Subscribe"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Invoice02Icon}
              strokeWidth={2}
              className="size-5"
            />
            Transaction History
          </CardTitle>
          <CardDescription>Your recent payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No transactions yet.
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium font-mono text-sm">
                      {tx.orderId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(tx.createdAt)}
                    </p>
                    {tx.paymentType && (
                      <p className="text-xs text-muted-foreground capitalize">
                        via {tx.paymentType.replace(/_/g, " ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatIDR(tx.amount)}</p>
                    <Badge variant={getStatusVariant(tx.status)}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
