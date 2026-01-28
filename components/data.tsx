"use client";
import {
    AudioWaveform,
    GalleryVerticalEnd,
    Command,
    LayoutDashboard,
    Calendar,
    LucideUsers,
    Logs,
    ChartColumn
} from "lucide-react";

export const data = {
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
    navSales: [
        {
            name: "Overview",
            url: "/marketing/overview",
            icon: ChartColumn,
        },
    ],
    navMarketing: [
        {
            name: "Overview",
            url: "/marketing/overview",
            icon: ChartColumn,
        },
        {
            name: "Calendar",
            url: "/marketing/calendar",
            icon: Calendar,
        },
        {
            name: "Campaign",
            url: "/marketing/activity",
            icon: Logs,
        },
        {
            name: "Users",
            url: "/marketing/users",
            icon: LucideUsers,
        },
    ],
};
