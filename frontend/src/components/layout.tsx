import * as React from 'react'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {AppSidebar} from '@/components/app-sidebar'
import {Separator} from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {useTSRBreadCrumbs} from '@/hooks/use-tsr-breadcrumbs'
import {ChevronRight} from 'lucide-react'

export default function Layout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  const {breadcrumb_routes} = useTSRBreadCrumbs()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <BreadcrumbPage>HOME</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumb_routes.map(({name, path}, i) => {
                  if (
                    breadcrumb_routes.length - 1 ===
                    breadcrumb_routes?.indexOf(breadcrumb_routes[i])
                  ) {
                    return (
                      <BreadcrumbItem key={path}>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>{name.toLocaleUpperCase()}</BreadcrumbPage>
                      </BreadcrumbItem>
                    )
                  }
                  return (
                    <BreadcrumbItem key={path}>
                      <BreadcrumbSeparator />
                      <BreadcrumbLink href={path}>
                        <BreadcrumbPage>
                          {name.toLocaleUpperCase()}
                        </BreadcrumbPage>
                      </BreadcrumbLink>
                      <ChevronRight className="size-4" />
                    </BreadcrumbItem>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div> */}
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
