import { type NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@/lib/midtrans";
import prisma from "@/lib/prisma";

/**
 * POST /api/billing/webhook - Handle Midtrans payment notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      payment_type: paymentType,
      fraud_status: fraudStatus,
    } = body;

    // Verify signature (skip in development for testing)
    if (process.env.NODE_ENV !== "development") {
      const isValid = verifySignature(
        orderId,
        statusCode,
        grossAmount,
        signatureKey,
      );

      if (!isValid) {
        console.error("Invalid Midtrans signature for order:", orderId);
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 403 },
        );
      }
    } else {
      console.log("⚠️ Skipping signature verification in development mode");
    }

    // Find transaction
    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
    });

    // Handle test notifications or unknown transactions
    if (!transaction) {
      // Check if this is a Midtrans test notification
      if (orderId.startsWith("payment_notif_test_")) {
        console.log("✓ Received Midtrans test notification:", orderId);
        return NextResponse.json({
          status: "ok",
          message: "Test notification received",
        });
      }

      console.error("Transaction not found:", orderId);
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    console.log("✓ Received Midtrans notification:", orderId);

    // Determine new status based on Midtrans response
    let newStatus = "pending";

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept" || !fraudStatus) {
        newStatus = "success";
      } else {
        newStatus = "failed";
      }
    } else if (
      transactionStatus === "deny" ||
      transactionStatus === "cancel" ||
      transactionStatus === "failure"
    ) {
      newStatus = "failed";
    } else if (transactionStatus === "expire") {
      newStatus = "expired";
    } else if (transactionStatus === "pending") {
      newStatus = "pending";
    }

    // Update transaction
    await prisma.transaction.update({
      where: { orderId },
      data: {
        status: newStatus,
        paymentType,
        midtransResponse: body,
      },
    });

    // If payment successful, create/update subscription
    if (newStatus === "success" && transaction.planId) {
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await prisma.subscription.upsert({
        where: { organizationId: transaction.organizationId },
        create: {
          organizationId: transaction.organizationId,
          planId: transaction.planId,
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
        update: {
          planId: transaction.planId,
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      });

      // Link transaction to subscription
      const subscription = await prisma.subscription.findUnique({
        where: { organizationId: transaction.organizationId },
      });

      if (subscription) {
        await prisma.transaction.update({
          where: { orderId },
          data: { subscriptionId: subscription.id },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
