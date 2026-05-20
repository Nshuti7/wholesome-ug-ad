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
import { NavUser, MeUser } from "@/components/nav-user";
import {
  IconDashboard,
  IconWorld,
  IconLocation,
  IconPhoto,
  IconNews,
  IconAddressBook,
  IconMail,
  IconUsers,
  IconSettings,
  IconUser,
  IconRefresh,
  IconStar,
  IconCalendar,
  IconMessageCircle,
  IconBinoculars,
} from "@tabler/icons-react";
import { getMe } from "@/services/auth";

const navMain = [
  { title: "Dashboard", url: "/", icon: IconDashboard },
  { title: "Destinations", url: "/destinations", icon: IconWorld },
  { title: "Itineraries", url: "/itineraries", icon: IconLocation },
  { title: "Experiences", url: "/experiences", icon: IconBinoculars },
  { title: "Testimonials", url: "/testimonials", icon: IconMessageCircle },
  { title: "Bookings", url: "/bookings", icon: IconCalendar },
  { title: "Gallery", url: "/gallery", icon: IconPhoto },
  { title: "Blogs", url: "/blogs", icon: IconNews },
  { title: "Reviews", url: "/reviews", icon: IconStar },
];

const navConnect = [
  { name: "Contact", url: "/contact", icon: IconAddressBook },
  { name: "Newsletter", url: "/newsletter", icon: IconMail },
  { name: "Team", url: "/team", icon: IconUsers },
];

const navSecondary = [
  { title: "Settings", url: "/settings", icon: IconSettings },
  { title: "Profile", url: "/profile", icon: IconUser },
  { title: "Revalidate", url: "/revalidate", icon: IconRefresh },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.data as MeUser);
      })
      .catch((err) => {
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
                  Wholesome Uganda
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
          // you can swap this for your Spinner if you have one
          <div className="p-4 text-center text-sm text-gray-500">
            Loading user…
          </div>
        ) : user ? (
          <NavUser user={user} />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
