"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  RefreshCw,
  Plus,
  Filter,
  X,
  Image as ImageIcon,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { useTeamOperations, type TeamFormData } from "@/hooks/useTeamOperations";
import type { TeamMember } from "@/lib/team/types";
import { teamFormFields, editSchema } from "@/lib/team/schema";
import { ReusableForm } from "@/components/ui/reusable-form";
import { format } from "date-fns";
import Image from "next/image";

export default function TeamPage() {
  const {
    teamMembers,
    loading,
    formLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useTeamOperations();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Filter team members
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.bio && member.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && member.published) ||
      (statusFilter === "draft" && !member.published);

    return matchesSearch && matchesStatus;
  });

  // Table columns
  const columns = [
    {
      key: "image",
      label: "Image",
      render: (member: TeamMember) => (
        <div className="w-16 h-16 relative rounded-full overflow-hidden border">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      ),
      className: "w-20",
    },
    {
      key: "name",
      label: "Name",
      render: (member: TeamMember) => (
        <div>
          <p className="font-medium">{member.name}</p>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
      ),
      className: "min-w-[200px]",
    },
    {
      key: "bio",
      label: "Bio",
      render: (member: TeamMember) => (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {member.bio || "-"}
        </p>
      ),
      className: "min-w-[200px]",
    },
    {
      key: "socialLinks",
      label: "Social Links",
      render: (member: TeamMember) => (
        <div className="flex flex-wrap gap-1">
          {member.socialLinks && member.socialLinks.length > 0 ? (
            member.socialLinks.slice(0, 2).map((link, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Link
              </a>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
          {member.socialLinks && member.socialLinks.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{member.socialLinks.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "order",
      label: "Order",
      render: (member: TeamMember) => (
        <span className="text-sm">{member.order ?? "-"}</span>
      ),
    },
    {
      key: "published",
      label: "Status",
      render: (member: TeamMember) => (
        <Badge
          variant={member.published ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          {member.published ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Published
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              Draft
            </>
          )}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (member: TeamMember) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(member.createdAt), "MMM dd, yyyy")}
          </span>
        </div>
      ),
    },
  ];

  const handleCreateSubmit = async (data: any) => {
    const formData: TeamFormData = {
      ...data,
      published: data.published ?? true,
      order: data.order ? Number(data.order) : undefined,
      socialLinks: data.socialLinks && Array.isArray(data.socialLinks) ? data.socialLinks : [],
    };

    const success = await handleCreate(formData);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedMember) return;

    const formData: TeamFormData = {
      ...data,
      published: data.published ?? selectedMember.published ?? true,
      order: data.order ? Number(data.order) : selectedMember.order,
      image: data.image instanceof File ? data.image : data.image || null,
      socialLinks: data.socialLinks && Array.isArray(data.socialLinks) ? data.socialLinks : selectedMember.socialLinks || [],
    };

    const success = await handleUpdate(formData, selectedMember._id);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedMember(null);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  const handleView = (member: TeamMember) => {
    setSelectedMember(member);
    setIsViewDialogOpen(true);
  };

  const onDelete = async (id: string) => {
    await handleDelete(id);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader pageTitle="Team" />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Team</h1>
              <p className="text-muted-foreground">
                Manage your team members
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, role, or bio..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-7 w-7 p-0"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="w-[180px]">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members ({filteredMembers.length})</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredMembers}
                columns={columns}
                loading={loading}
                onEdit={handleEdit}
                onDelete={onDelete}
                onView={handleView}
                emptyMessage="No team members found. Create your first team member!"
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
          </DialogHeader>
          <ReusableForm
            fields={teamFormFields}
            onSubmit={handleCreateSubmit}
            validationSchema={editSchema}
            defaultValues={{
              published: true,
              order: 0,
              socialLinks: [],
            }}
            submitButtonText="Create Team Member"
            isLoading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <ReusableForm
              fields={teamFormFields.map((field) => ({
                ...field,
                required: field.name === "image" ? false : field.required,
              }))}
              onSubmit={handleEditSubmit}
              validationSchema={editSchema}
              defaultValues={{
                name: selectedMember.name,
                role: selectedMember.role,
                bio: selectedMember.bio || "",
                order: selectedMember.order ?? 0,
                published: selectedMember.published ?? true,
                image: selectedMember.image, // Existing image URL
                socialLinks: selectedMember.socialLinks || [],
              }}
              submitButtonText="Update Team Member"
              isLoading={formLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Team Member</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {selectedMember.image && (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border flex-shrink-0">
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                  <p className="text-lg text-muted-foreground mb-2">{selectedMember.role}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge
                      variant={selectedMember.published ? "default" : "secondary"}
                    >
                      {selectedMember.published ? "Published" : "Draft"}
                    </Badge>
                    {selectedMember.order !== undefined && (
                      <span>Order: {selectedMember.order}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedMember.bio && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Biography</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {selectedMember.bio}
                    </p>
                  </div>
                </>
              )}
              
              {selectedMember.socialLinks && selectedMember.socialLinks.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Social Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.socialLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Created:</strong>{" "}
                  {format(
                    new Date(selectedMember.createdAt),
                    "MMM dd, yyyy 'at' h:mm a"
                  )}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {format(
                    new Date(selectedMember.updatedAt),
                    "MMM dd, yyyy 'at' h:mm a"
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

