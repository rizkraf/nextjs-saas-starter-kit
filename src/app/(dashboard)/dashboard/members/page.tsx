"use client";

import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

interface Member {
  id: string;
  role: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export default function MembersPage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const orgId = activeOrg?.id;

  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["members", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const result = await authClient.organization.listMembers({
        query: { organizationId: orgId },
      });
      return (result.data?.members as Member[]) || [];
    },
    enabled: !!orgId,
  });

  if (!activeOrg) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Select an organization first.</p>
      </div>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
        <p className="text-muted-foreground">
          Manage team members for {activeOrg.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon
              icon={UserGroupIcon}
              strokeWidth={2}
              className="size-5"
            />
            Members
          </CardTitle>
          <CardDescription>{members.length} member(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">
              Loading members...
            </p>
          ) : members.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No members found.
            </p>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.user.image || undefined} />
                      <AvatarFallback>
                        {member.user.name?.charAt(0) ||
                          member.user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {member.user.name || "No name"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
