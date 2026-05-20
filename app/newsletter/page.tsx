"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  ReusableForm,
  createFormSchema,
  FormField,
} from "@/components/ui/reusable-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Mail as MailIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Trash2 as TrashIcon,
  MoreHorizontal,
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  Filter,
  RefreshCw,
  Check,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import api from "@/utils/api";
import * as z from "zod";
import Loader from "@/components/ui/Loader";

interface Subscriber {
  _id: string;
  email: string;
  subscribed: boolean;
  createdAt: string;
  lastSubscriptionAttempt?: string;
}

interface SubscriberFormData {
  email: string;
}

const subscriberFormFields: FormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "Enter subscriber email",
    required: true,
    description: "Add a new subscriber to your newsletter",
  },
];

const subscriberSchema =
  createFormSchema<SubscriberFormData>(subscriberFormFields);

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteSubscriber, setDeleteSubscriber] = useState<Subscriber | null>(
    null
  );
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/newsletter");
      setSubscribers(response.data);
      toast.success("Subscribers loaded successfully");
    } catch (error) {
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Add subscriber
  const handleAddSubscriber = async (data: SubscriberFormData) => {
    try {
      await api.post("/newsletter/subscribe", { email: data.email });
      toast.success("Subscriber added successfully");
      setIsAddDialogOpen(false);
      fetchSubscribers();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to add subscriber";
      toast.error(message);
      throw error; // Re-throw to prevent form reset
    }
  };

  // Toggle subscription status
  const handleToggleStatus = async (subscriber: Subscriber) => {
    const subscriberId = subscriber._id;
    setProcessingIds((prev) => new Set(prev).add(subscriberId));

    try {
      if (subscriber.subscribed) {
        await api.post("/newsletter/unsubscribe", { email: subscriber.email });
        toast.success("Subscriber unsubscribed");
      } else {
        await api.post("/newsletter/subscribe", { email: subscriber.email });
        toast.success("Subscriber reactivated");
      }

      // Update local state
      setSubscribers((prev) =>
        prev.map((s) =>
          s._id === subscriberId ? { ...s, subscribed: !s.subscribed } : s
        )
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update subscriber";
      toast.error(message);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(subscriberId);
        return newSet;
      });
    }
  };

  // Delete subscriber
  const handleDeleteSubscriber = async (subscriber: Subscriber) => {
    try {
      await api.delete(`/newsletter/${subscriber._id}`);
      setSubscribers((prev) => prev.filter((s) => s._id !== subscriber._id));
      toast.success("Subscriber deleted successfully");
      setDeleteSubscriber(null);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete subscriber";
      toast.error(message);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const csvContent = [
      ["Email", "Status", "Subscribed Date"],
      ...filteredSubscribers.map((sub) => [
        sub.email,
        sub.subscribed ? "Active" : "Inactive",
        new Date(sub.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-subscribers-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  // Filter subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) => {
      const matchesSearch = subscriber.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && subscriber.subscribed) ||
        (statusFilter === "inactive" && !subscriber.subscribed);

      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = subscribers.length;
    const active = subscribers.filter((s) => s.subscribed).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [subscribers]);

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
        <SiteHeader pageTitle="Newsletter Management" />

        <div className="flex-1 space-y-6 p-6">
          {/* Header Section */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <MailIcon className="h-8 w-8 text-primary" />
                Newsletter Subscribers
              </h1>
              <p className="text-muted-foreground">
                Manage your newsletter subscribers and track engagement
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSubscribers}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={filteredSubscribers.length === 0}
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export CSV
              </Button>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Subscriber
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subscriber</DialogTitle>
                    <DialogDescription>
                      Add a new email address to your newsletter subscription
                      list.
                    </DialogDescription>
                  </DialogHeader>

                  <ReusableForm
                    fields={subscriberFormFields}
                    onSubmit={handleAddSubscriber}
                    validationSchema={subscriberSchema}
                    submitButtonText="Add Subscriber"
                    resetOnSubmit={true}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Subscribers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All registered emails
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Subscribers
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.active}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently subscribed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inactive Subscribers
                </CardTitle>
                <UserX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.inactive}
                </div>
                <p className="text-xs text-muted-foreground">Unsubscribed</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center space-x-2">
                  <SearchIcon className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscribers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="status-filter" className="text-sm">
                    Filter:
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="capitalize"
                      >
                        {statusFilter === "all" ? "All Status" : statusFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("active")}
                      >
                        Active Only
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("inactive")}
                      >
                        Inactive Only
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader />
                </div>
              ) : filteredSubscribers.length === 0 ? (
                <div className="text-center py-8">
                  <MailIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No subscribers found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "Start by adding your first subscriber"}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subscribed Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscribers.map((subscriber) => (
                        <TableRow key={subscriber._id}>
                          <TableCell className="font-medium">
                            {subscriber.email}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={subscriber.subscribed}
                                onCheckedChange={() =>
                                  handleToggleStatus(subscriber)
                                }
                                disabled={processingIds.has(subscriber._id)}
                              />
                              <Badge
                                variant={
                                  subscriber.subscribed
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  subscriber.subscribed
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                              >
                                {subscriber.subscribed ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              subscriber.createdAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      subscriber.email
                                    )
                                  }
                                >
                                  Copy Email
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setDeleteSubscriber(subscriber)
                                  }
                                  className="text-red-600"
                                >
                                  <TrashIcon className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={!!deleteSubscriber}
            onOpenChange={() => setDeleteSubscriber(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Confirm Deletion
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to permanently delete this subscriber?
                  <br />
                  <strong>{deleteSubscriber?.email}</strong>
                  <br />
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteSubscriber(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    deleteSubscriber && handleDeleteSubscriber(deleteSubscriber)
                  }
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Subscriber
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>

      <Toaster />
    </SidebarProvider>
  );
}
