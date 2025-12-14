import {
  Building03Icon,
  CreditCardIcon,
  FolderLibraryIcon,
  Home01Icon,
  Invoice02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Home01Icon,
    title: "Dashboard Overview",
    description:
      "Dapatkan insight instan dengan kartu statistik yang menampilkan jumlah proyek, anggota tim, dan paket langganan Anda.",
  },
  {
    icon: Building03Icon,
    title: "Multi-Organisasi",
    description:
      "Buat dan kelola beberapa organisasi sekaligus. Cocok untuk agensi atau bisnis yang mengelola tim terpisah.",
  },
  {
    icon: FolderLibraryIcon,
    title: "Manajemen Proyek",
    description:
      "Buat, edit, dan kelola proyek dalam setiap organisasi. Tambahkan deskripsi dan lacak tanggal pembuatan.",
  },
  {
    icon: UserGroupIcon,
    title: "Anggota Tim & Peran",
    description:
      "Undang anggota tim ke organisasi Anda. Tetapkan peran seperti Owner, Admin, atau Member dengan izin berbasis peran.",
  },
  {
    icon: CreditCardIcon,
    title: "Paket Langganan",
    description:
      "Pilih dari berbagai paket harga. Lihat langganan aktif, detail paket, dan tanggal perpanjangan Anda.",
  },
  {
    icon: Invoice02Icon,
    title: "Riwayat Transaksi",
    description:
      "Lihat riwayat pembayaran lengkap dengan ID pesanan, jumlah, metode pembayaran, dan status transaksi.",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="border-t bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Semua yang Tim Anda Butuhkan
          </h2>
          <p className="text-lg text-muted-foreground">
            Dashboard lengkap dengan semua fitur untuk mengelola organisasi Anda
            secara efektif.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-none bg-background/50 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <HugeiconsIcon
                    icon={feature.icon}
                    strokeWidth={2}
                    className="size-6 text-primary"
                  />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
