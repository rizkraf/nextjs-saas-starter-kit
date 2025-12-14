import { Github01Icon, Rocket01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <HugeiconsIcon
                  icon={Rocket01Icon}
                  strokeWidth={2}
                  className="size-5 text-primary-foreground"
                />
              </div>
              <span className="text-lg font-semibold">Nexus</span>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Platform all-in-one untuk tim berkolaborasi dalam proyek, kelola
              anggota, dan atur tagihan.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 font-semibold">Produk</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Fitur
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Harga
                </Link>
              </li>
            </ul>
          </div>

          {/* Starter Kit Links */}
          <div>
            <h3 className="mb-4 font-semibold">Starter Kit</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <HugeiconsIcon
                    icon={Github01Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Dokumentasi
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">Lisensi MIT</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© {currentYear} Nexus. Hak cipta dilindungi.</p>
          <p>
            Dibangun dengan{" "}
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Next.js SaaS Starter Kit
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
