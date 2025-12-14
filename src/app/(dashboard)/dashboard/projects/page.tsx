"use client";

import {
  Delete02Icon,
  Edit02Icon,
  FolderLibraryIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const orgId = activeOrg?.id;

  // Form states
  const [newProjectName, setNewProjectName] = React.useState("");
  const [newProjectDescription, setNewProjectDescription] = React.useState("");

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(
    null,
  );
  const [editName, setEditName] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");

  // View dialog states
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [viewingProject, setViewingProject] = React.useState<Project | null>(
    null,
  );

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects", orgId],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    enabled: !!orgId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", orgId] });
      setNewProjectName("");
      setNewProjectDescription("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      description?: string;
    }) => {
      const res = await fetch(`/api/projects/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", orgId] });
      setEditDialogOpen(false);
      setEditingProject(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", orgId] });
    },
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    createMutation.mutate({
      name: newProjectName,
      description: newProjectDescription || undefined,
    });
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description || "");
    setEditDialogOpen(true);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editName.trim()) return;
    updateMutation.mutate({
      id: editingProject.id,
      name: editName,
      description: editDescription || undefined,
    });
  };

  const handleViewProject = (project: Project) => {
    setViewingProject(project);
    setViewDialogOpen(true);
  };

  if (!activeOrg) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Select an organization first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage projects for {activeOrg.name}
          </p>
        </div>
      </div>

      {/* Create Project */}
      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>
            Add a new project to your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={createMutation.isPending || !newProjectName.trim()}
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  strokeWidth={2}
                  className="size-4 mr-2"
                />
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
            <Textarea
              placeholder="Project description (optional)"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              rows={2}
            />
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon
              icon={FolderLibraryIcon}
              strokeWidth={2}
              className="size-5"
            />
            All Projects
          </CardTitle>
          <CardDescription>{projects.length} project(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No projects yet. Create your first project above.
            </p>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                // biome-ignore lint/a11y/useSemanticElements: false
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleViewProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleViewProject(project);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View project ${project.name}`}
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.description || "No description"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created:{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(project);
                      }}
                    >
                      <HugeiconsIcon
                        icon={Edit02Icon}
                        strokeWidth={2}
                        className="size-4"
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(project.id);
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <HugeiconsIcon
                        icon={Delete02Icon}
                        strokeWidth={2}
                        className="size-4"
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Project Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewingProject?.name}</DialogTitle>
            <DialogDescription>Project details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <p className="mt-1">
                {viewingProject?.description || "No description"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Created At
              </Label>
              <p className="mt-1">
                {viewingProject?.createdAt
                  ? new Date(viewingProject.createdAt).toLocaleString()
                  : "-"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Project ID
              </Label>
              <p className="mt-1 font-mono text-sm">{viewingProject?.id}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (viewingProject) handleOpenEdit(viewingProject);
                setViewDialogOpen(false);
              }}
            >
              <HugeiconsIcon
                icon={Edit02Icon}
                strokeWidth={2}
                className="size-4 mr-2"
              />
              Edit
            </Button>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProject}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Project name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Project description (optional)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || !editName.trim()}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
