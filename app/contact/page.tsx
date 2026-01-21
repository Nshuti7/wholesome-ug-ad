"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search,
  RefreshCw,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  User,
  MessageSquare,
  Filter,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Loader from "@/components/ui/Loader";
import api from "@/utils/api";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string; // Optional since backend doesn't have this field
  message: string;
  status: "new" | "in progress" | "resolved" | "unread" | "read" | "replied";
  createdAt: string;
  updatedAt: string;
}

interface ContactResponse {
  success: boolean;
  data: ContactMessage[];
  total: number;
  count: number;
}

const statusConfig = {
  new: {
    label: "New",
    icon: AlertCircle,
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  unread: {
    label: "New",
    icon: AlertCircle,
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  "in progress": {
    label: "In Progress",
    icon: Clock,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  read: {
    label: "In Progress",
    icon: Clock,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    badgeClass: "bg-green-100 text-green-800 border-green-200",
  },
  replied: {
    label: "Resolved",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    badgeClass: "bg-green-100 text-green-800 border-green-200",
  },
};

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(
    null
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const limit = 10;

  const fetchContacts = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await api.get(`/contact?${params}`);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to fetch contacts");
      }

      const data: ContactResponse = response.data;

      // Handle both wrapped and unwrapped responses
      let contactsArray: ContactMessage[] = [];
      let totalCount = 0;

      if (Array.isArray(data)) {
        // If response is directly an array
        contactsArray = data;
        totalCount = data.length;
      } else if (data && typeof data === 'object' && 'data' in data) {
        // If response is wrapped with data property
        contactsArray = Array.isArray(data.data) ? data.data : [];
        totalCount = data.total || data.count || contactsArray.length;
      } else {
        contactsArray = [];
        totalCount = 0;
      }

      let filteredContacts = contactsArray;

      // Client-side filtering
      if (search) {
        filteredContacts = filteredContacts.filter(
          (contact) =>
            contact.name.toLowerCase().includes(search.toLowerCase()) ||
            contact.email.toLowerCase().includes(search.toLowerCase()) ||
            (contact.subject && contact.subject.toLowerCase().includes(search.toLowerCase()))
        );
      }

      if (status !== "all") {
        filteredContacts = filteredContacts.filter((contact) => {
          // Map backend status values to frontend filter values
          const statusMap: Record<string, string[]> = {
            new: ["new", "unread"],
            "in progress": ["in progress", "read"],
            resolved: ["resolved", "replied"],
          };
          const matchingStatuses = statusMap[status] || [status];
          return matchingStatuses.includes(contact.status);
        });
      }

      setContacts(filteredContacts);
      
      // Use filtered count for pagination when filtering client-side
      const displayCount = (search || status !== "all") ? filteredContacts.length : totalCount;
      setTotalContacts(displayCount);
      
      // Ensure totalPages is always a valid number
      const calculatedPages = Math.ceil(displayCount / limit);
      setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      setActionLoading(true);

      // Map frontend status values to backend status values
      const statusMap: Record<string, string> = {
        new: "unread",
        "in progress": "read",
        resolved: "replied",
      };
      const backendStatus = statusMap[status] || status;

      const response = await api.patch(`/contact/${id}`, { status: backendStatus });

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to update contact status");
      }

      await fetchContacts(currentPage, searchQuery, statusFilter);

      if (selectedContact && selectedContact._id === id) {
        setSelectedContact({ ...selectedContact, status: backendStatus as any });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      setActionLoading(true);

      const response = await api.delete(`/contact/${id}`);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to delete contact");
      }

      await fetchContacts(currentPage, searchQuery, statusFilter);
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contact");
    } finally {
      setActionLoading(false);
    }
  };

  const viewContact = async (contact: ContactMessage) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);

    // Auto-update status to 'in progress' if it's 'new'
    if (contact.status === "new") {
      await updateContactStatus(contact._id, "in progress");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchContacts(currentPage, searchQuery, statusFilter);
  }, [currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchContacts(1, searchQuery, statusFilter);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter]);

  const filteredContactsCount = contacts.length;

  const getStatusCount = (status: string) => {
    // Map frontend status to backend status values
    const statusMap: Record<string, string[]> = {
      new: ["new", "unread"],
      "in progress": ["in progress", "read"],
      resolved: ["resolved", "replied"],
    };
    const matchingStatuses = statusMap[status] || [status];
    return contacts.filter((c) => matchingStatuses.includes(c.status)).length;
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
        <SiteHeader pageTitle="Contact Messages" />

        <div className="flex-1 space-y-6 p-6">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
                <p className="text-muted-foreground">
                  Manage and respond to customer inquiries and feedback
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalContacts}</div>
                <p className="text-xs text-muted-foreground">
                  All time messages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New</CardTitle>
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{getStatusCount("new")}</div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{getStatusCount("in progress")}</div>
                <p className="text-xs text-muted-foreground">
                  Being handled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{getStatusCount("resolved")}</div>
                <p className="text-xs text-muted-foreground">
                  Completed
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
                      placeholder="Search by name, email, or subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchQuery || statusFilter !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>

                <Button
                  onClick={() =>
                    fetchContacts(currentPage, searchQuery, statusFilter)
                  }
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      fetchContacts(currentPage, searchQuery, statusFilter)
                    }
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No messages found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "Contact messages will appear here when submitted."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => {
                    // Safely get status config with fallback
                    const statusKey = contact.status || "new";
                    const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.new;
                    const StatusIcon = status.icon;
                    
                    return (
                      <div
                        key={contact._id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(contact.name)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium truncate">
                                  {contact.name}
                                </h4>
                                <Badge
                                  variant="secondary"
                                  className={`${status.badgeClass} text-xs flex items-center gap-1`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {status.label}
                                </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground mb-1 truncate">
                                {contact.email}
                              </p>

                              {contact.subject && (
                                <p className="text-sm font-medium mb-2 truncate">
                                  {contact.subject}
                                </p>
                              )}

                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {contact.message}
                              </p>

                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(contact.createdAt)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => viewContact(contact)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                
                                {contact.status !== "resolved" && (
                                  <DropdownMenuItem 
                                    onClick={() => updateContactStatus(contact._id, "resolved")}
                                    disabled={actionLoading}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Resolved
                                  </DropdownMenuItem>
                                )}
                                
                                {contact.status === "new" && (
                                  <DropdownMenuItem 
                                    onClick={() => updateContactStatus(contact._id, "in progress")}
                                    disabled={actionLoading}
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Mark as In Progress
                                  </DropdownMenuItem>
                                )}
                                
                                {contact.status === "in progress" && (
                                  <DropdownMenuItem 
                                    onClick={() => updateContactStatus(contact._id, "new")}
                                    disabled={actionLoading}
                                  >
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Mark as New
                                  </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setContactToDelete(contact._id);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {!loading && contacts.length > 0 && (
                <div className="flex items-center justify-between pt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {contacts.length > 0 ? (currentPage - 1) * limit + 1 : 0} to{" "}
                    {Math.min(currentPage * limit, totalContacts)} of{" "}
                    {totalContacts || 0} messages
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <span className="text-sm text-muted-foreground px-3">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* View Contact Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Message Details
              </DialogTitle>
            </DialogHeader>

            {selectedContact && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Name
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(selectedContact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {selectedContact.name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="mt-1">{selectedContact.email}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Date Received
                    </Label>
                    <p className="mt-1">
                      {formatDate(selectedContact.createdAt)}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Status
                    </Label>
                    <div className="mt-1">
                      <Select
                        value={
                          selectedContact.status === "unread" ? "new" :
                          selectedContact.status === "read" ? "in progress" :
                          selectedContact.status === "replied" ? "resolved" :
                          selectedContact.status
                        }
                        onValueChange={(value) =>
                          updateContactStatus(selectedContact._id, value)
                        }
                        disabled={actionLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {selectedContact.subject && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Subject
                    </Label>
                    <p className="mt-1 font-medium">{selectedContact.subject}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Message
                  </Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Contact Message</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this contact message? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  contactToDelete && deleteContact(contactToDelete)
                }
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
