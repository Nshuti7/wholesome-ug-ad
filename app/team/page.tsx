"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  ReusableForm,
  createFormSchema,
  FormField,
} from "@/components/ui/reusable-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Plus,
  Users,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  UserPlus,
  Building2,
  Crown,
  Code,
  Heart,
  Briefcase,
  Search,
  MoreHorizontal,
  X,
} from "lucide-react";
import * as z from "zod";
import api from "@/utils/api";
import Loader from "@/components/ui/Loader";

// Types
interface TeamMember {
  _id: string;
  fullName: string;
  position: string;
  bio: string;
  linkedIn?: string;
  category: string;
  image?: string;
  cloudinaryId?: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamFormData {
  fullName: string;
  position: string;
  bio: string;
  linkedIn?: string;
  category: string;
  image?: File;
}

// Category configurations with icons and colors
const categoryConfig = {
  Leadership: {
    icon: Crown,
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  Engineering: { 
    icon: Code, 
    color: "bg-blue-500", 
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  Operations: {
    icon: Briefcase,
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  Community: { 
    icon: Heart, 
    color: "bg-red-500", 
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  Partners: {
    icon: Building2,
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  "Advisory Board": {
    icon: Crown,
    color: "bg-indigo-500",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  Alumni: {
    icon: Users,
    color: "bg-teal-500",
    textColor: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
  },
  "Support Staff": {
    icon: Users,
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  Researchers: {
    icon: Code,
    color: "bg-cyan-500",
    textColor: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
  },
  Mentors: {
    icon: Heart,
    color: "bg-pink-500",
    textColor: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  Contractors: {
    icon: Briefcase,
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  Other: { 
    icon: Building2, 
    color: "bg-gray-500", 
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
};

// Form configuration
const teamFormFields: FormField[] = [
  {
    name: "fullName",
    type: "text",
    label: "Full Name",
    placeholder: "Enter team member's full name",
    required: true,
    validation: z.string().min(2, "Name must be at least 2 characters"),
  },
  {
    name: "position",
    type: "text",
    label: "Position",
    placeholder: "Enter job title/position",
    required: true,
    validation: z.string().min(2, "Position must be at least 2 characters"),
  },
  {
    name: "bio",
    type: "textarea",
    label: "Bio",
    placeholder: "Enter a brief biographical description (max 500 characters)",
    required: true,
    description: "Brief description of the team member's background, expertise, or role",
    validation: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio cannot exceed 500 characters"),
  },
  {
    name: "category",
    type: "select",
    label: "Category",
    required: true,
    options: Object.keys(categoryConfig).map((cat) => ({
      value: cat,
      label: cat,
    })),
    validation: z.string().min(1, "Please select a category"),
  },
  {
    name: "linkedIn",
    type: "url",
    label: "LinkedIn Profile (Optional)",
    placeholder: "https://linkedin.com/in/username",
    description: "Optional LinkedIn profile URL",
    validation: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
  },
  {
    name: "image",
    type: "image",
    label: "Profile Image",
    accept: "image/*",
    maxSize: 5,
    showPreview: true,
    description: "Upload a profile image (max 5MB, recommended: 400x400px)",
    validation: z.any().optional(),
  },
];

const teamFormSchema = createFormSchema<TeamFormData>(teamFormFields);

// Team Member Card Component
const TeamMemberCard: React.FC<{
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (memberId: string) => void;
  isDeleting: boolean;
}> = ({ member, onEdit, onDelete, isDeleting }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const config = categoryConfig[member.category as keyof typeof categoryConfig] || categoryConfig.Other;
  const Icon = config.icon;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-border/50">
            <AvatarImage src={member.image} alt={member.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(member.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground truncate">
                  {member.fullName}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {member.position}
                </p>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="secondary" 
                    className={`${config.bgColor} ${config.textColor} ${config.borderColor} text-xs flex items-center gap-1`}
                  >
                    <Icon className="h-3 w-3" />
                    {member.category}
                  </Badge>
                </div>

                {member.bio && (
                  <p className="text-muted-foreground text-xs mb-2 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {member.bio}
                  </p>
                )}

                {member.linkedIn && (
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    LinkedIn
                  </a>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(member)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Member
                  </DropdownMenuItem>
                  
                  {member.linkedIn && (
                    <DropdownMenuItem asChild>
                      <a
                        href={member.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View LinkedIn
                      </a>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={() => onDelete(member._id)}
                    disabled={isDeleting}
                    className="text-red-600 focus:text-red-600"
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Team Page Component
export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Fetch team members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/team");
      if (response.data.success) {
        // Flatten the grouped data into a single array
        const groupedData = response.data.data;
        const allMembers: TeamMember[] = [];
        Object.values(groupedData).forEach((categoryMembers: any) => {
          allMembers.push(...categoryMembers);
        });
        setMembers(allMembers);
      } else {
        toast.error("Failed to fetch team members");
      }
    } catch (error) {
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle form submission
  const handleSubmit = async (data: TeamFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("fullName", data.fullName);
      formData.append("position", data.position);
      formData.append("bio", data.bio);
      formData.append("category", data.category);
      if (data.linkedIn) formData.append("linkedIn", data.linkedIn);
      if (data.image) formData.append("image", data.image);

      let response;
      if (editingMember) {
        // Update existing member
        response = await api.put(`/team/${editingMember._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new member
        response = await api.post("/team", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success(
          editingMember
            ? "Team member updated successfully!"
            : "Team member added successfully!"
        );
        setIsFormOpen(false);
        setEditingMember(null);
        fetchMembers();
      } else {
        toast.error(response.data.message || "Failed to save team member");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to save team member"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle member deletion
  const handleDelete = async (memberId: string) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(memberId));
      const response = await api.delete(`/team/${memberId}`);

      if (response.data.success) {
        toast.success("Team member deleted successfully!");
        fetchMembers();
      } else {
        toast.error("Failed to delete team member");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete team member"
      );
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  // Handle edit
  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  // Handle new member
  const handleNewMember = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  // Get form default values
  const getDefaultValues = () => {
    if (editingMember) {
      return {
        fullName: editingMember.fullName,
        position: editingMember.position,
        bio: editingMember.bio,
        category: editingMember.category,
        linkedIn: editingMember.linkedIn || "",
      };
    }
    return {
      fullName: "",
      position: "",
      bio: "",
      category: "",
      linkedIn: "",
    };
  };

  // Filter members based on search and category
  const filteredMembers = members.filter((member) => {
    const matchesSearch = 
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || member.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Group filtered members by category
  const groupedMembers = filteredMembers.reduce((acc, member) => {
    if (!acc[member.category]) {
      acc[member.category] = [];
    }
    acc[member.category].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  const totalMembers = members.length;
  const filteredCount = filteredMembers.length;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader pageTitle="Team Management" />

        <div className="flex-1 space-y-6 p-6">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                <p className="text-muted-foreground">
                  Manage your team members across different categories and roles
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMembers}</div>
                <p className="text-xs text-muted-foreground">
                  All team members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(groupedMembers).length}</div>
                <p className="text-xs text-muted-foreground">
                  Active categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leadership</CardTitle>
                <Crown className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {members.filter(m => m.category === "Leadership").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Leadership team
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engineering</CardTitle>
                <Code className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {members.filter(m => m.category === "Engineering").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tech team
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name, position, or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">All Categories</option>
                    {Object.keys(categoryConfig).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  {(searchQuery || categoryFilter !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("all");
                      }}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>

                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleNewMember} className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMember
                          ? "Edit Team Member"
                          : "Add New Team Member"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingMember
                          ? "Update the team member's information below."
                          : "Fill in the details to add a new team member."}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                      <ReusableForm
                        fields={teamFormFields}
                        onSubmit={handleSubmit}
                        validationSchema={teamFormSchema}
                        defaultValues={getDefaultValues()}
                        submitButtonText={
                          editingMember ? "Update Member" : "Add Member"
                        }
                        isLoading={isSubmitting}
                        mode="onChange"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader />
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {searchQuery || categoryFilter !== "all" 
                      ? "No members found" 
                      : "No team members yet"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery || categoryFilter !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "Get started by adding your first team member."}
                  </p>
                  {!searchQuery && categoryFilter === "all" && (
                    <Button onClick={handleNewMember} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add First Member
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedMembers)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([category, categoryMembers]) => {
                      const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.Other;
                      const Icon = config.icon;
                      
                      return (
                        <div key={category} className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${config.bgColor}`}>
                              <Icon className={`w-5 h-5 ${config.color.replace("bg-", "text-")}`} />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">{category}</h3>
                              <p className="text-sm text-muted-foreground">
                                {categoryMembers.length} {categoryMembers.length === 1 ? "member" : "members"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryMembers.map((member) => (
                              <TeamMemberCard
                                key={member._id}
                                member={member}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isDeleting={deletingIds.has(member._id)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Results Summary */}
              {!loading && filteredMembers.length > 0 && (
                <div className="flex items-center justify-between pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredCount} of {totalMembers} members
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
