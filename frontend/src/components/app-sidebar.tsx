import * as React from 'react'
import {
  BookOpen,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  SquareTerminal,
  Users,
} from 'lucide-react'

import {NavMain} from '@/components/nav-main'
import {NavUser} from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {userQueryOptions} from '@/lib/api'
import {useQuery} from '@tanstack/react-query'
import {Link} from '@tanstack/react-router'
import { NavProjects } from './nav-projects'
import { NavSecondary } from './nav-secondary'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Properties',
      url: '/properties',
      icon: Frame,
    },
    {
      title: 'Clients',
      url: '/clients',
      icon: Users,
    },
    {
      title: 'Calendar',
      url: '/calendar',
      icon: BookOpen,
    },
    {
      title: 'Reports',
      url: '/reports',
      icon: PieChart,
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const { data:user } = useQuery(userQueryOptions())
  
  console.log(user)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Avery',
            email: user?.email || '',
            name: user?.name || '',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
