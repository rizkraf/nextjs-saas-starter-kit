"use client";

import {
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceMonthly: number;
  features: string[];
}

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export function LandingCTA() {
  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await fetch("/api/billing/plans");
      if (!res.ok) throw new Error("Failed to fetch plans");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const recommendedIndex = plans.length > 1 ? 1 : 0;

  return (
    <section id="pricing" className="relative overflow-hidden py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Harga Sederhana & Transparan
          </h2>
          <p className="text-lg text-muted-foreground">
            Pilih paket yang sesuai untuk tim Anda. Upgrade atau downgrade kapan
            saja.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl items-stretch gap-8 pt-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader className="text-center">
                    <Skeleton className="mx-auto mb-2 h-6 w-20" />
                    <Skeleton className="mx-auto h-10 w-32" />
                    <Skeleton className="mx-auto mt-2 h-4 w-28" />
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <div className="flex-1 space-y-2">
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                    <Skeleton className="mt-6 h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            plans.map((plan, index) => {
              const isPopular = index === recommendedIndex && plans.length > 1;
              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col overflow-visible ${isPopular ? "border-primary shadow-lg" : ""}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Paling Populer
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">
                        {plan.priceMonthly === 0
                          ? "Gratis"
                          : formatIDR(plan.priceMonthly)}
                      </span>
                      {plan.priceMonthly > 0 && (
                        <span className="text-muted-foreground">/bln</span>
                      )}
                    </div>
                    {plan.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <ul className="flex-1 space-y-2">
                      {plan.features.map((feature, i) => (
                        <li
                          key={`${plan.id}-feature-${i}`}
                          className="flex items-center gap-2 text-sm"
                        >
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            strokeWidth={2}
                            className="size-4 shrink-0 text-primary"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={isPopular ? "default" : "outline"}
                      className="mt-6 w-full"
                      asChild
                    >
                      <Link href="/sign-up">
                        {plan.priceMonthly === 0
                          ? "Mulai Gratis"
                          : "Coba Gratis"}
                        {isPopular && (
                          <HugeiconsIcon
                            icon={ArrowRight02Icon}
                            strokeWidth={2}
                            className="size-4"
                          />
                        )}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
