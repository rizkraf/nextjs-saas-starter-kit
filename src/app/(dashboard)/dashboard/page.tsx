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
        <h2 className="text-xl font-semibold mb-2">No Organization Selected</h2>
        <p className="text-muted-foreground mb-4">
          Create or select an organization to get started.
        </p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome to {activeOrg.name}
        </h1>
        <p className="text-muted-foreground">
          Manage your organization's projects, members, and billing.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <HugeiconsIcon
              icon={FolderLibraryIcon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              Active projects in this organization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <HugeiconsIcon
              icon={UserGroupIcon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Members with access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <HugeiconsIcon
              icon={CreditCardIcon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionData?.plan.name || "Free"}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscriptionData
                ? "Active subscription"
                : "No active subscription"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest projects in this organization
            </CardDescription>
          </div>
          <Button size="sm" asChild>
            <Link href="/dashboard/projects">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No projects yet.</p>
              <Button className="mt-4" size="sm" asChild>
                <Link href="/dashboard/projects">
                  Create Your First Project
                </Link>
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
                      {project.description || "No description"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.id}`}>View</Link>
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
