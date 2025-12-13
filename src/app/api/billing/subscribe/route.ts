import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createSnapTransaction } from "@/lib/midtrans";
import prisma from "@/lib/prisma";

/**
 * POST /api/billing/subscribe - Create a subscription payment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json(
        { error: "No active organization" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 },
      );
    }

    // Get plan details
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { id: session.session.activeOrganizationId },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      );
    }

    // Generate unique order ID
    const orderId = `SUB-${organization.id.slice(0, 8)}-${Date.now()}`;

    // Create transaction record with planId
    const transaction = await prisma.transaction.create({
      data: {
        orderId,
        organizationId: organization.id,
        planId: plan.id,
        amount: plan.priceMonthly,
        status: "pending",
      },
    });

    // Create Midtrans Snap transaction
    const snapTransaction = await createSnapTransaction({
      orderId,
      amount: plan.priceMonthly,
      customerName: session.user.name || "Customer",
      customerEmail: session.user.email,
      itemName: `${plan.name} Plan - Monthly`,
      itemId: plan.id,
    });

    return NextResponse.json({
      transactionId: transaction.id,
      orderId,
      token: snapTransaction.token,
      redirectUrl: snapTransaction.redirectUrl,
    });
  } catch (error) {
    console.error("Failed to create subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 },
    );
  }
}
