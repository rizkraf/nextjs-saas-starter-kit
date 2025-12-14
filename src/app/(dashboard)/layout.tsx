"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function DashboardHeader() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("/projects")) return "Projects";
    if (pathname.includes("/members")) return "Members";
    if (pathname.includes("/billing")) return "Billing";
    if (pathname.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-full" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathname !== "/dashboard" && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
