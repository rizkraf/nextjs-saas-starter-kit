"use client";

import {
  Building03Icon,
  CreditCardIcon,
  FolderLibraryIcon,
  Home01Icon,
  LogoutIcon,
  PlusSignIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home01Icon },
  { title: "Projects", href: "/dashboard/projects", icon: FolderLibraryIcon },
  { title: "Members", href: "/dashboard/members", icon: UserGroupIcon },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCardIcon },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: organizations, refetch } = authClient.useListOrganizations();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newOrgName, setNewOrgName] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  const handleSwitchOrg = async (orgId: string) => {
    await authClient.organization.setActive({ organizationId: orgId });
    router.refresh();
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setIsCreating(true);
    try {
      const slug = newOrgName.toLowerCase().replace(/\s+/g, "-");
      const result = await authClient.organization.create({
        name: newOrgName,
        slug,
      });
      if (result.data) {
        await authClient.organization.setActive({
          organizationId: result.data.id,
        });
        refetch();
        router.refresh();
      }
      setNewOrgName("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create organization:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <HugeiconsIcon
                        icon={Building03Icon}
                        strokeWidth={2}
                        className="size-4"
                      />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeOrg?.name || "Select Organization"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {activeOrg?.slug || "No organization"}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                  align="start"
                >
                  <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {organizations?.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => handleSwitchOrg(org.id)}
                      className={activeOrg?.id === org.id ? "bg-accent" : ""}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className="bg-muted flex size-6 items-center justify-center rounded">
                          <HugeiconsIcon
                            icon={Building03Icon}
                            strokeWidth={2}
                            className="size-3"
                          />
                        </div>
                        <span className="flex-1">{org.name}</span>
                        {activeOrg?.id === org.id && (
                          <span className="text-primary">✓</span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => setIsCreateDialogOpen(true)}
                  >
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      strokeWidth={2}
                      className="mr-2 size-4"
                    />
                    Create Organization
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <HugeiconsIcon
                          icon={item.icon}
                          strokeWidth={2}
                          className="size-4"
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={session?.user?.image || undefined} />
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.name || "Guest"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session?.user?.email || ""}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                  align="end"
                  side="top"
                >
                  <DropdownMenuItem onClick={handleSignOut}>
                    <HugeiconsIcon
                      icon={LogoutIcon}
                      strokeWidth={2}
                      className="mr-2 size-4"
                    />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Create Organization Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateOrg}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  placeholder="My Organization"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || !newOrgName.trim()}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
