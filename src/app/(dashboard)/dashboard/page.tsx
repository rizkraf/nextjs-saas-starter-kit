"use client";

import {
  CreditCardIcon,
  FolderLibraryIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

interface Subscription {
  id: string;
  status: string;
  plan: {
    name: string;
  };
}

export default function DashboardPage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const orgId = activeOrg?.id;

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects", orgId],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    enabled: !!orgId,
  });

  const { data: subscriptionData } = useQuery<Subscription | null>({
    queryKey: ["subscription", orgId],
    queryFn: async () => {
      const res = await fetch("/api/billing/subscription");
      if (!res.ok) return null;
      const data = await res.json();
      return data?.id ? data : null;
    },
    enabled: !!orgId,
  });

  if (!activeOrg) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold mb-2">
          Belum Ada Organisasi Dipilih
        </h2>
        <p className="text-muted-foreground mb-4">
          Buat atau pilih organisasi untuk memulai.
        </p>
        <Button asChild>
          <Link href="/">Ke Beranda</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Selamat Datang di {activeOrg.name}
        </h1>
        <p className="text-muted-foreground">
          Kelola proyek, anggota, dan tagihan organisasi Anda.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Proyek</CardTitle>
            <HugeiconsIcon
              icon={FolderLibraryIcon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              Proyek aktif di organisasi ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Anggota Tim</CardTitle>
            <HugeiconsIcon
              icon={UserGroupIcon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Anggota dengan akses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Paket Saat Ini
            </CardTitle>
            <HugeiconsIcon
              icon={CreditCardIcon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionData?.plan.name || "Gratis"}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscriptionData
                ? "Langganan aktif"
                : "Tidak ada langganan aktif"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Proyek Terbaru</CardTitle>
            <CardDescription>
              Proyek terbaru Anda di organisasi ini
            </CardDescription>
          </div>
          <Button size="sm" asChild>
            <Link href="/dashboard/projects">Lihat Semua</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Belum ada proyek.</p>
              <Button className="mt-4" size="sm" asChild>
                <Link href="/dashboard/projects">Buat Proyek Pertama Anda</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.description || "Tidak ada deskripsi"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.id}`}>
                      Lihat
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
