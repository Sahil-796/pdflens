"use client"

import {
  type LucideIcon,
  ChevronRight,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
    items?: {
      title: string
      url: string
      isActive?: boolean
    }[]
  }[]
}) {

  const router = useRouter()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tools</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <Collapsible
            key={item.name}
            asChild
            defaultOpen={true}
            className="group/collapsible group-data-[collapsible=icon]:hidden"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.name}>
                  <item.icon />
                  <span>{item.name}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={subItem.isActive}
                        onClick={() => router.push(subItem.url)}
                        className="cursor-pointer data-[active=true]:bg-primary/5 data-[active=true]:text-primary transition-colors"
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
