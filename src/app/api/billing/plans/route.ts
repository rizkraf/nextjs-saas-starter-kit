import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/billing/plans - List all available plans
 */
export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: "asc" },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 },
    );
  }
}
