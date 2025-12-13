/** biome-ignore-all lint/performance/noImgElement: false */
/** biome-ignore-all lint/a11y/noRedundantAlt: false */
"use client";

import {
  BluetoothIcon,
  Building03Icon,
  CodeIcon,
  ComputerIcon,
  CreditCardIcon,
  Delete02Icon,
  DownloadIcon,
  EyeIcon,
  File01Icon,
  FileIcon,
  FloppyDiskIcon,
  FolderIcon,
  FolderLibraryIcon,
  FolderOpenIcon,
  HelpCircleIcon,
  KeyboardIcon,
  LanguageCircleIcon,
  LayoutIcon,
  LogoutIcon,
  MailIcon,
  MoonIcon,
  MoreHorizontalCircle01Icon,
  MoreVerticalCircle01Icon,
  NotificationIcon,
  PaintBoardIcon,
  PlusSignIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  SunIcon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Example, ExampleWrapper } from "@/components/example";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <CardExample />
      <FormExample />
      <LogoutExample />
      <OrganizationExample />
      <ProjectExample />
      <BillingExample />
    </ExampleWrapper>
  );
}

function LogoutExample() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  if (isPending) {
    return (
      <Example title="Session">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </Example>
    );
  }

  if (!session) {
    return (
      <Example title="Session">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Not Signed In</CardTitle>
            <CardDescription>Sign in to see your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/sign-in")} className="w-full">
              Sign in
            </Button>
          </CardContent>
        </Card>
      </Example>
    );
  }

  return (
    <Example title="Session">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="size-12 rounded-full"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <HugeiconsIcon
                  icon={UserIcon}
                  strokeWidth={2}
                  className="size-6"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate">
                {session.user.name || "User"}
              </CardTitle>
              <CardDescription className="truncate">
                {session.user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </Example>
  );
}

function OrganizationExample() {
  const { data: session } = authClient.useSession();
  const { data: organizations, isPending: orgsLoading } =
    authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [orgName, setOrgName] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleCreateOrg = async () => {
    if (!orgName.trim()) return;
    setIsCreating(true);
    setError("");
    try {
      const slug = orgName.toLowerCase().replace(/\s+/g, "-");
      await authClient.organization.create({ name: orgName, slug });
      setOrgName("");
    } catch {
      setError("Failed to create organization");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSetActive = async (orgId: string) => {
    try {
      await authClient.organization.setActive({ organizationId: orgId });
    } catch {
      setError("Failed to set active organization");
    }
  };

  if (!session) {
    return (
      <Example title="Organizations">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Sign in to manage organizations
            </p>
          </CardContent>
        </Card>
      </Example>
    );
  }

  return (
    <Example title="Organizations">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon
              icon={UserGroupIcon}
              strokeWidth={2}
              className="size-5"
            />
            Organizations
          </CardTitle>
          <CardDescription>
            {activeOrg ? `Active: ${activeOrg.name}` : "No active organization"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Input
              placeholder="Organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              disabled={isCreating}
            />
            <Button
              onClick={handleCreateOrg}
              disabled={isCreating || !orgName.trim()}
              size="icon"
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            </Button>
          </div>
          <div className="space-y-2">
            {orgsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : organizations?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No organizations yet
              </p>
            ) : (
              organizations?.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Building03Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                    <span className="text-sm font-medium">{org.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={activeOrg?.id === org.id ? "secondary" : "outline"}
                    onClick={() => handleSetActive(org.id)}
                    disabled={activeOrg?.id === org.id}
                  >
                    {activeOrg?.id === org.id ? "Active" : "Set Active"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </Example>
  );
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  organizationId: string;
  createdAt: string;
}

function ProjectExample() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [projectName, setProjectName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const fetchProjects = React.useCallback(async () => {
    if (!activeOrg) return;
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch {
      console.error("Failed to fetch projects");
    }
  }, [activeOrg]);

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    if (!projectName.trim() || !activeOrg) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName }),
      });
      if (res.ok) {
        setProjectName("");
        fetchProjects();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create project");
      }
    } catch {
      setError("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProjects();
      }
    } catch {
      console.error("Failed to delete project");
    }
  };

  if (!activeOrg) {
    return (
      <Example title="Projects">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Select an organization first
            </p>
          </CardContent>
        </Card>
      </Example>
    );
  }

  return (
    <Example title="Projects">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon
              icon={FolderLibraryIcon}
              strokeWidth={2}
              className="size-5"
            />
            Projects
          </CardTitle>
          <CardDescription>{activeOrg.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Input
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={isLoading}
            />
            <Button
              onClick={handleCreateProject}
              disabled={isLoading || !projectName.trim()}
              size="icon"
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            </Button>
          </div>
          <div className="space-y-2">
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet</p>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={FolderIcon}
                      strokeWidth={2}
                      className="size-4"
                    />
                    <span className="text-sm font-medium">{project.name}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </Example>
  );
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceMonthly: number;
  features: string[];
}

interface Subscription {
  id: string;
  status: string;
  currentPeriodEnd: string;
  plan: Plan;
}

function BillingExample() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [subscription, setSubscription] = React.useState<Subscription | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);

  const fetchSubscription = React.useCallback(async () => {
    if (!activeOrg) return;
    try {
      const res = await fetch("/api/billing/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch {
      console.error("Failed to fetch subscription");
    }
  }, [activeOrg]);

  React.useEffect(() => {
    fetch("/api/billing/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleSubscribe = async (planId: string) => {
    if (!activeOrg) return;
    setIsLoading(true);
    setSelectedPlan(planId);
    try {
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.error("Subscribe error:", error);
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  if (!activeOrg) {
    return (
      <Example title="Billing">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Select an organization first
            </p>
          </CardContent>
        </Card>
      </Example>
    );
  }

  return (
    <Example title="Billing">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon
              icon={CreditCardIcon}
              strokeWidth={2}
              className="size-5"
            />
            Subscription Plans
          </CardTitle>
          <CardDescription>Choose a plan for {activeOrg.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active Subscription */}
          {subscription && (
            <div className="rounded-lg border border-green-500/50 bg-green-50 p-3 dark:bg-green-950/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Active: {subscription.plan.name}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500">
                    Expires: {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
                <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                  {subscription.status}
                </span>
              </div>
            </div>
          )}

          {/* Plans List */}
          <div className="space-y-2">
            {plans.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No plans available
              </p>
            ) : (
              plans.map((plan) => {
                const isCurrentPlan = subscription?.plan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      isCurrentPlan ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {plan.priceMonthly === 0
                          ? "Free"
                          : formatIDR(plan.priceMonthly) + "/mo"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={isCurrentPlan ? "outline" : "default"}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isLoading || isCurrentPlan}
                    >
                      {isLoading && selectedPlan === plan.id
                        ? "Loading..."
                        : isCurrentPlan
                          ? "Current"
                          : "Subscribe"}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </Example>
  );
}

function CardExample() {
  return (
    <Example title="Card" className="items-center justify-center">
      <Card className="relative w-full max-w-sm overflow-hidden pt-0">
        <div className="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
        <img
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Photo by mymind on Unsplash"
          title="Photo by mymind on Unsplash"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
        />
        <CardHeader>
          <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
          <CardDescription>
            Switch to the improved way to explore your data, with natural
            language. Monitoring will no longer be available on the Pro plan in
            November, 2025
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                Show Dialog
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <HugeiconsIcon icon={BluetoothIcon} strokeWidth={2} />
                </AlertDialogMedia>
                <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to allow the USB accessory to connect to this
                  device?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                <AlertDialogAction>Allow</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Badge variant="secondary" className="ml-auto">
            Warning
          </Badge>
        </CardFooter>
      </Card>
    </Example>
  );
}

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const;

function FormExample() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  });
  const [theme, setTheme] = React.useState("light");

  return (
    <Example title="Form">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HugeiconsIcon
                    icon={MoreVerticalCircle01Icon}
                    strokeWidth={2}
                  />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>File</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
                    New File
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={FolderIcon} strokeWidth={2} />
                    New Folder
                    <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <HugeiconsIcon icon={FolderOpenIcon} strokeWidth={2} />
                      Open Recent
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
                            Project Alpha
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
                            Project Beta
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <HugeiconsIcon
                                icon={MoreHorizontalCircle01Icon}
                                strokeWidth={2}
                              />
                              More Projects
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  <HugeiconsIcon
                                    icon={CodeIcon}
                                    strokeWidth={2}
                                  />
                                  Project Gamma
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <HugeiconsIcon
                                    icon={CodeIcon}
                                    strokeWidth={2}
                                  />
                                  Project Delta
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
                            Browse...
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />
                    Save
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={DownloadIcon} strokeWidth={2} />
                    Export
                    <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        email: checked === true,
                      })
                    }
                  >
                    <HugeiconsIcon icon={EyeIcon} strokeWidth={2} />
                    Show Sidebar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        sms: checked === true,
                      })
                    }
                  >
                    <HugeiconsIcon icon={LayoutIcon} strokeWidth={2} />
                    Show Status Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <HugeiconsIcon icon={PaintBoardIcon} strokeWidth={2} />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                          <DropdownMenuRadioGroup
                            value={theme}
                            onValueChange={setTheme}
                          >
                            <DropdownMenuRadioItem value="light">
                              <HugeiconsIcon icon={SunIcon} strokeWidth={2} />
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <HugeiconsIcon icon={MoonIcon} strokeWidth={2} />
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              <HugeiconsIcon
                                icon={ComputerIcon}
                                strokeWidth={2}
                              />
                              System
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
                      Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <HugeiconsIcon
                              icon={KeyboardIcon}
                              strokeWidth={2}
                            />
                            Keyboard Shortcuts
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <HugeiconsIcon
                              icon={LanguageCircleIcon}
                              strokeWidth={2}
                            />
                            Language
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <HugeiconsIcon
                                icon={NotificationIcon}
                                strokeWidth={2}
                              />
                              Notifications
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>
                                    Notification Types
                                  </DropdownMenuLabel>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.push}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        push: checked === true,
                                      })
                                    }
                                  >
                                    <HugeiconsIcon
                                      icon={NotificationIcon}
                                      strokeWidth={2}
                                    />
                                    Push Notifications
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.email}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        email: checked === true,
                                      })
                                    }
                                  >
                                    <HugeiconsIcon
                                      icon={MailIcon}
                                      strokeWidth={2}
                                    />
                                    Email Notifications
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={ShieldIcon} strokeWidth={2} />
                            Privacy & Security
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
                    Sign Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Name</FieldLabel>
                  <Input
                    id="small-form-name"
                    placeholder="Enter your name"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-role">Role</FieldLabel>
                  <Select defaultValue="">
                    <SelectTrigger id="small-form-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="small-form-framework">
                  Framework
                </FieldLabel>
                <Combobox items={frameworks}>
                  <ComboboxInput
                    id="small-form-framework"
                    placeholder="Select a framework"
                    required
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <Field>
                <FieldLabel htmlFor="small-form-comments">Comments</FieldLabel>
                <Textarea
                  id="small-form-comments"
                  placeholder="Add any additional comments"
                />
              </Field>
              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  );
}
