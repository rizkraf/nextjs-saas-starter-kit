import { ArrowRight02Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1.5">
            <HugeiconsIcon
              icon={SparklesIcon}
              strokeWidth={2}
              className="size-3.5"
            />
            Dibangun untuk Tim & Organisasi
          </Badge>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Pusat Proyek{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Tim Anda
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Buat organisasi, kelola proyek, undang anggota tim, dan atur tagihan
            — semua dari satu dashboard yang powerful.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Mulai Gratis
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Masuk</Link>
            </Button>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-muted-foreground">
            Tanpa kartu kredit · Paket gratis tersedia · Batalkan kapan saja
          </p>
        </div>
      </div>
    </section>
  );
}
