import Loader from '@/components/shared/loader';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';
import { useAuth } from '@/provider/auth';
import { Toaster } from '@/components/ui/sonner';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useAuth();

  if (isPending) {
    return <Loader fullHeight />;
  }

  const currentPath = window.location.pathname;
  const isLoginPage = currentPath === '/auth/login/';

  // If user is authenticated but trying to access login page, redirect to dashboard/home
  if (user && isLoginPage) {
    const redirectUrl = new URL('/', window.location.origin); // or '/dashboard'
    window.location.href = redirectUrl.toString();
    return <Loader fullHeight />;
  }

  // If user is not authenticated and not on login page, redirect to login
  if (!user && !isLoginPage) {
    const redirectUrl = new URL('/auth/login/', window.location.origin);
    if (currentPath !== '/auth/login/' && currentPath !== '/') {
      redirectUrl.searchParams.set('redirect', encodeURIComponent(window.location.href));
    }
    window.location.href = redirectUrl.toString();
    return <Loader fullHeight />;
  }

  return <>{children}</>;
}


const RootLayout = () => (
  <Suspense fallback={<Loader fullHeight />}>
    <AuthGuard>
      <Outlet />
      <Toaster position="top-right" />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </AuthGuard>
  </Suspense>
);

export const Route = createRootRoute({ component: RootLayout });


// import { AppSidebar } from '@/components/layout/sidebar'
// import AppHeader from '@/components/layout/sidebar/header'
// import Loader from '@/components/shared/loader'
// import { SidebarInset, SidebarMenuSkeleton, SidebarProvider } from '@/components/ui/sidebar'
// import { createRootRoute,Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
// import { Suspense } from 'react'

// const RootLayout = () => (
//   <SidebarProvider
//     className="relative h-screen overflow-y-hidden"
//     defaultOpen={true}
//     suppressHydrationWarning
//   >
//     <AppHeader />
//     <Suspense fallback={<SidebarMenuSkeleton />}>
//       <AppSidebar />
//     </Suspense>
//     <SidebarInset>
//       <Suspense fallback={<Loader fullHeight />}>
//         <Outlet />
//         <TanStackRouterDevtools />
//       </Suspense>
//     </SidebarInset>
//   </SidebarProvider>
// )

// export const Route = createRootRoute({ component: RootLayout })