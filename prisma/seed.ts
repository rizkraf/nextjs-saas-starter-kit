import prisma from "../src/lib/prisma";

const plans = [
  {
    name: "Free",
    slug: "free",
    description: "Sempurna untuk memulai",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "1 Proyek",
      "3 Anggota Tim",
      "Dukungan Dasar",
      "Akses Komunitas",
    ],
    isActive: true,
  },
  {
    name: "Starter",
    slug: "starter",
    description: "Untuk tim kecil dan bisnis berkembang",
    priceMonthly: 99000, // Rp 99.000
    priceYearly: 990000, // Rp 990.000 (hemat 2 bulan)
    features: [
      "10 Proyek",
      "10 Anggota Tim",
      "Dukungan Email",
      "Akses API",
      "Dashboard Analitik",
    ],
    isActive: true,
  },
  {
    name: "Pro",
    slug: "pro",
    description: "Untuk bisnis mapan dan agensi",
    priceMonthly: 299000, // Rp 299.000
    priceYearly: 2990000, // Rp 2.990.000 (hemat 2 bulan)
    features: [
      "Proyek Tak Terbatas",
      "50 Anggota Tim",
      "Dukungan Prioritas",
      "Akses API Lanjutan",
      "Analitik Lanjutan",
      "Integrasi Kustom",
      "Log Audit",
    ],
    isActive: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    description: "Untuk organisasi besar dengan kebutuhan khusus",
    priceMonthly: 999000, // Rp 999.000
    priceYearly: 9990000, // Rp 9.990.000 (hemat 2 bulan)
    features: [
      "Proyek Tak Terbatas",
      "Anggota Tim Tak Terbatas",
      "Dukungan Dedikasi 24/7",
      "Akses API Kustom",
      "Opsi White-label",
      "Jaminan SLA",
      "Kontrak Kustom",
      "Opsi On-premise",
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
