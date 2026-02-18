"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon, List, User, Brain } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import CreateTaskDialog from "@/components/web/create-task-dialog";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const items: NavItem[] = [
  {
    title: "Tasks",
    url: "/tasks",
    icon: List,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        {/* App brand */}
        <div className="px-3 py-4 bg-secondary/30 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <span className="inline-block rounded-md bg-primary/10 px-2 py-1 text-primary">
              <Brain className="h-5 w-5 text-primary" />
            </span>
            <span className="text-black dark:text-white">Primetrade</span>
          </Link>
        </div>

        {/* Primary action */}
        <div className="px-3 pt-4">
          <CreateTaskDialog />
        </div>

        {/* Main App Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === item.url || pathname?.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="transition-transform hover:scale-[1.01]"
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
