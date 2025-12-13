/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function BillingStatus() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");
  const statusCode = searchParams.get("status_code");
  const transactionStatus = searchParams.get("transaction_status");

  const isSuccess =
    status === "finish" &&
    (transactionStatus === "settlement" || transactionStatus === "capture");
  const isPending = status === "pending" || transactionStatus === "pending";
  const isError = status === "error" || transactionStatus === "deny";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            {isSuccess && (
              <svg
                className="size-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {isPending && (
              <svg
                className="size-8 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {isError && (
              <svg
                className="size-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {!isSuccess && !isPending && !isError && (
              <svg
                className="size-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            )}
          </div>
          <CardTitle>
            {isSuccess && "Payment Successful!"}
            {isPending && "Payment Pending"}
            {isError && "Payment Failed"}
            {!isSuccess && !isPending && !isError && "Billing"}
          </CardTitle>
          <CardDescription>
            {isSuccess &&
              "Thank you for your subscription. Your payment has been processed."}
            {isPending &&
              "Your payment is being processed. We'll notify you once it's complete."}
            {isError &&
              "There was an issue with your payment. Please try again."}
            {!isSuccess &&
              !isPending &&
              !isError &&
              "Manage your subscription and billing."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="text-muted-foreground">Order ID</p>
              <p className="font-mono">{orderId}</p>
            </div>
          )}
          {(statusCode || transactionStatus) && (
            <div className="grid grid-cols-2 gap-3">
              {statusCode && (
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p className="text-muted-foreground">Status Code</p>
                  <p className="font-medium">{statusCode}</p>
                </div>
              )}
              {transactionStatus && (
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p className="text-muted-foreground">Transaction</p>
                  <p className="font-medium capitalize">{transactionStatus}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/">Back to Home</Link>
            </Button>
            {isError && (
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">Try Again</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <BillingStatus />
    </Suspense>
  );
}
