"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface SupportItem {
  title: string;
  url: string;
  icon: Icon;
}

export function NavSecondary({
  items,
  ...props
}: {
  items: SupportItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Support</SidebarGroupLabel>
      <SidebarGroupContent>
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
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={btnClasses}
                >
                  <Link
                    href={item.url}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
