"use client";

import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
import { Separator } from "./ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Building2, LayoutDashboard, MessageSquarePlus } from "lucide-react";

const font = Pixelify_Sans({
  subsets: ["latin"],
  weight: "400",
});

const items = [
  {
    title: "Queries",
    url: "/queries",
    icon: MessageSquarePlus,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reputations",
    url: "/reputations",
    icon: Building2,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="pt-4">
        <Link href="/" className={`${font.className} text-2xl font-bold px-2`}>
          InsightAnon
        </Link>
      </SidebarHeader>
      <Separator className="w-full bg-white/20" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-2">
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="text-[18px] font-medium">
                      <item.icon className="size-8" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center justify-center w-full h-full">
                <ConnectButton />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
