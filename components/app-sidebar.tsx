// components/AppSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/components/ui/logo";
import { NavMain } from "@/components/nav-main";
import { NavConnect } from "@/components/nav-connect";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import type { MeUser } from "@/lib/auth/types";
import {
  IconDashboard,
  IconPhoto,
  IconAddressBook,
  IconMail,
  IconSettings,
  IconUser,
  IconRefresh,
  IconMicrophone,
  IconLibraryPhoto,
  IconFileText,
  IconUsers,
} from "@tabler/icons-react";
import { getMe } from "@/services/auth";

const navMain = [
  { title: "Dashboard", url: "/", icon: IconDashboard },
  { title: "Hero", url: "/hero", icon: IconPhoto },
  { title: "Blog", url: "/blog", icon: IconFileText },
  { title: "Gallery", url: "/gallery", icon: IconLibraryPhoto },
  { title: "Services", url: "/services", icon: IconMicrophone },
  { title: "Team", url: "/team", icon: IconUsers },
];

const navConnect = [
  { name: "Contact", url: "/contact", icon: IconAddressBook },
  { name: "Newsletter", url: "/newsletter", icon: IconMail },
];

const navSecondary = [
  { title: "Settings", url: "/settings", icon: IconSettings },
  { title: "Profile", url: "/profile", icon: IconUser },
  { title: "Revalidate", url: "/revalidate", icon: IconRefresh },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then((res) => {
        // Validate that we have the expected user data structure - be more lenient
        const userData = res.data;
        if (userData && (userData._id || userData.id) && userData.email) {
          // Name might be optional, email is required
          setUser({
            _id: userData._id || userData.id,
            name: userData.name || "User",
            email: userData.email,
            profileImage: userData.profileImage || null,
            role: userData.role || "admin",
            createdAt: userData.createdAt || new Date().toISOString(),
            updatedAt: userData.updatedAt || new Date().toISOString(),
          } as MeUser);
          setError(null);
        } else {
          console.warn('Invalid user data structure:', userData);
          setError('Invalid user data');
          // If user data is invalid, redirect to login
          router.replace("/login");
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load user data');
        // Failed to fetch user data
        // If not logged in, send them to /login
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="!p-1.5">
              <a href="/">
                <Logo />
                <span className="ml-2 text-base font-semibold">
                  Wholesome Uganda Admin
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavConnect items={navConnect} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {loading ? (
          // Show loading state
          <div className="p-4 text-center text-sm text-gray-500">
            Loading user…
          </div>
        ) : error ? (
          // Show error state
          <div className="p-4 text-center text-sm text-red-500">
            {error}
          </div>
        ) : user ? (
          // Show user when data is valid
          <NavUser user={user} />
        ) : (
          // Fallback when no user data
          <div className="p-4 text-center text-sm text-gray-500">
            No user data
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
