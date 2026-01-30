"use client";

import * as React from "react";
import {
  AudioWaveform,
  GalleryVerticalEnd,
  Command,
  LayoutDashboard,
  Calendar,
  LucideUsers,
  Logs,
  ChartColumn,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavMarketing } from "@/components/nav-marketing";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "CITIA ENGINEERING",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ],
  navMarketing: [
    {
      name: "Overview",
      url: "/marketing/overview",
      icon: ChartColumn,
    },
    {
      name: "Campaign Calendar",
      url: "/marketing/calendar",
      icon: Calendar,
    },
    {
      name: "Campaign Activity",
      url: "/marketing/activity",
      icon: Logs,
    },
    {
      name: "User List",
      url: "/marketing/users",
      icon: LucideUsers,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMarketing items={data.navMarketing} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
