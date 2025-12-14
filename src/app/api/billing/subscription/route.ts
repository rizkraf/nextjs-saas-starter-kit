import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/billing/subscription - Get current organization subscription
 */
export async function GET() {
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

    const subscription = await prisma.subscription.findUnique({
      where: { organizationId: session.session.activeOrganizationId },
      include: {
        plan: true,
      },
    });

    // Fetch all transactions for the organization
    const transactions = await prisma.transaction.findMany({
      where: { organizationId: session.session.activeOrganizationId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      ...subscription,
      transactions,
    });
  } catch (error) {
    console.error("Failed to fetch subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 },
    );
  }
}
