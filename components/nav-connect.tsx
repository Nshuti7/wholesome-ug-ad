"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface ConnectItem {
  name: string;
  url: string;
  icon: Icon;
}

export function NavConnect({ items }: { items: ConnectItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Connect</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;
          const btnClasses = [
            "flex items-center gap-2 w-full transition-colors duration-150",
            "hover:bg-secondary/10 hover:text-secondary-foreground",
            isActive
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className={btnClasses}
              >
                <Link
                  href={item.url}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
