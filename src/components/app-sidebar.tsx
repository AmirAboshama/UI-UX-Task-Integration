"use client"

import * as React from "react"
import {
  Bot,
  Users,
  Megaphone,
  BarChart3,
  Mic,
  AudioLines,
  FileAudio,
  Phone,
  MessageSquare,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Omar",
    email: "omar@olimi.ai",
    avatar: "",
  },
  navGroups: [
    {
      label: "AI Call Agent",
      items: [
        { title: "Agents", url: "/agents", icon: Bot },
        { title: "Customer List", url: "/customers", icon: Users },
        { title: "Campaigns", url: "/campaigns", icon: Megaphone },
        { title: "Analytics", url: "#", icon: BarChart3 },
        { title: "Recordings", url: "/recordings", icon: Mic },
      ],
    },
    {
      label: "Text to Speech",
      items: [{ title: "Generate Speech", url: "#", icon: AudioLines }],
    },
    {
      label: "Transcription (ASR)",
      items: [{ title: "Transcribe Audio", url: "#", icon: FileAudio }],
    },
    {
      label: "WhatsApp Marketing",
      items: [
        { title: "Connected Numbers", url: "#", icon: Phone },
        { title: "WhatsApp Campaigns", url: "#", icon: MessageSquare },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Bot className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Olimi</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={data.navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
