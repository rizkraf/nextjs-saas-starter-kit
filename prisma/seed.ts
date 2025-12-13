import prisma from "../src/lib/prisma";

const plans = [
  {
    name: "Free",
    slug: "free",
    description: "Perfect for getting started",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "1 Project",
      "3 Team Members",
      "Basic Support",
      "Community Access",
    ],
    isActive: true,
  },
  {
    name: "Starter",
    slug: "starter",
    description: "For small teams and growing businesses",
    priceMonthly: 99000, // Rp 99.000
    priceYearly: 990000, // Rp 990.000 (save 2 months)
    features: [
      "10 Projects",
      "10 Team Members",
      "Email Support",
      "API Access",
      "Analytics Dashboard",
    ],
    isActive: true,
  },
  {
    name: "Pro",
    slug: "pro",
    description: "For established businesses and agencies",
    priceMonthly: 299000, // Rp 299.000
    priceYearly: 2990000, // Rp 2.990.000 (save 2 months)
    features: [
      "Unlimited Projects",
      "50 Team Members",
      "Priority Support",
      "Advanced API Access",
      "Advanced Analytics",
      "Custom Integrations",
      "Audit Logs",
    ],
    isActive: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    description: "For large organizations with custom needs",
    priceMonthly: 999000, // Rp 999.000
    priceYearly: 9990000, // Rp 9.990.000 (save 2 months)
    features: [
      "Unlimited Projects",
      "Unlimited Team Members",
      "24/7 Dedicated Support",
      "Custom API Access",
      "White-label Option",
      "SLA Guarantee",
      "Custom Contracts",
      "On-premise Option",
    ],
    isActive: true,
  },
];

async function seed() {
  console.log("🌱 Seeding plans...");

  for (const plan of plans) {
    const existing = await prisma.plan.findUnique({
      where: { slug: plan.slug },
    });

    if (existing) {
      await prisma.plan.update({
        where: { slug: plan.slug },
        data: plan,
      });
      console.log(`  ✓ Updated plan: ${plan.name}`);
    } else {
      await prisma.plan.create({
        data: plan,
      });
      console.log(`  ✓ Created plan: ${plan.name}`);
    }
  }

  console.log("✅ Seeding complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
