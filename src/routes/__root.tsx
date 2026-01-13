import { AppSidebar } from '@/components/layout/sidebar'
import AppHeader from '@/components/layout/sidebar/header'
import Loader from '@/components/shared/loader'
import { SidebarInset, SidebarMenuSkeleton, SidebarProvider } from '@/components/ui/sidebar'
import { createRootRoute,Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Suspense } from 'react'

const RootLayout = () => (
  <SidebarProvider
    className="relative h-screen overflow-y-hidden"
    defaultOpen={true}
    suppressHydrationWarning
  >
    <AppHeader />
    <Suspense fallback={<SidebarMenuSkeleton />}>
      <AppSidebar />
    </Suspense>
    <SidebarInset>
      <Suspense fallback={<Loader fullHeight />}>
        <Outlet />
        <TanStackRouterDevtools />
      </Suspense>
    </SidebarInset>
  </SidebarProvider>
)

export const Route = createRootRoute({ component: RootLayout })