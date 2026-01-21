"use client";

import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Camera,
  Edit3,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getMe, updateProfile } from "@/services/auth";
import Loader from "@/components/ui/Loader";

interface UserProfile {
  name: string;
  email: string;
  profileImage?: string;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    profileImage: "",
  });

  const [editForm, setEditForm] = useState<UserProfile>({
    name: "",
    email: "",
    profileImage: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "success",
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getMe();
        
        // getMe already extracts { data: user } from backend response
        const userData = response.data;
        
        // Validate user data structure - be more lenient
        if (!userData) {
          console.error("No user data received:", response);
          showNotification("No user data received. Please try logging in again.", "error");
          return;
        }
        
        // Check if we have at least email (name might be empty initially)
        if (!userData.email) {
          console.error("User data missing email:", userData);
          showNotification("Invalid user data: missing email", "error");
          return;
        }
        
        // Map backend response to profile format - use defaults if missing
        const profileData: UserProfile = {
          name: userData.name || "User", // Default name if missing
          email: userData.email || "",
          profileImage: userData.profileImage || "",
        };
        
        setProfile(profileData);
        setEditForm(profileData);
      } catch (error: any) {
        console.error("Failed to load profile:", error);
        showNotification(
          error?.response?.data?.message || "Failed to load profile data",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showNotification("Image size must be less than 5MB", "error");
        return;
      }

      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Start editing mode
  const startEditing = () => {
    setEditForm(profile);
    setSelectedImage(null);
    setPreviewUrl("");
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setPreviewUrl("");
    setEditForm(profile);
  };

  // Show notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      setIsSaving(true);
      setShowSaveDialog(false);

      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("email", editForm.email);

      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      const response = await updateProfile(formData);
      
      // Backend returns { success: true, data: { id, name, email, role, profileImage } }
      const updatedData = response.data?.data || response.data;
      
      if (updatedData && (updatedData.name || updatedData.email)) {
        const profileData: UserProfile = {
          name: updatedData.name || profile.name,
          email: updatedData.email || profile.email,
          profileImage: updatedData.profileImage || profile.profileImage || "",
        };
        setProfile(profileData);
        setEditForm(profileData);
        setIsEditing(false);
        setSelectedImage(null);
        setPreviewUrl("");
        showNotification("Profile updated successfully!", "success");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      showNotification(
        error?.response?.data?.message || "Failed to update profile. Please try again.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar source
  const getAvatarSrc = () => {
    if (previewUrl) return previewUrl;
    return profile.profileImage || "";
  };

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
        <SiteHeader pageTitle="Profile" />

        <div className="flex-1 space-y-6 p-6">
          {/* Notification Alert */}
          {notification.show && (
            <Alert
              className={`border-l-4 ${
                notification.type === "success"
                  ? "border-green-500 bg-green-50 text-green-800"
                  : "border-red-500 bg-red-50 text-red-800"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          )}

          {/* Profile Header Card */}
          <Card className="overflow-hidden">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-primary shadow-lg">
                    <AvatarImage src={getAvatarSrc()} alt={profile.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {getUserInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100"
                      asChild
                    >
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Camera className="h-4 w-4" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageSelect}
                        />
                      </label>
                    </Button>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-primary mt-1">{profile.email}</p>
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-primary text-white"
                  >
                    Active User
                  </Badge>
                </div>

                {!isEditing && (
                  <Button
                    variant="secondary"
                    onClick={startEditing}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Profile Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your personal information"
                  : "View your account details"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader />
                </div>
              ) : isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  {selectedImage && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border">
                      <Camera className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        New image selected: {selectedImage.name}
                      </span>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={cancelEditing}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setShowSaveDialog(true)}
                      disabled={isSaving}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <p className="font-medium">{profile.name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Confirmation Dialog */}
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Profile Changes</DialogTitle>
                <DialogDescription>
                  Are you sure you want to update your profile information? This
                  will change your account details.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
