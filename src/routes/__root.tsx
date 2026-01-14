
import { useEffect } from 'react';
import Loader from '@/components/shared/loader';
import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';
import { useAuth } from '@/provider/auth';
import { Toaster } from '@/components/ui/sonner';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    const currentPath = window.location.pathname;
    const isLoginPage = currentPath === '/auth/login/';

    // If user is authenticated but on login page, redirect to dashboard
    if (user && isLoginPage) {
      router.navigate({ to: '/' });
      return;
    }

    // If user is not authenticated and not on login page, redirect to login
    if (!user && !isLoginPage) {
      const search: Record<string, unknown> = {};
      if (currentPath !== '/' && currentPath !== '/auth/login/') {
        search.redirect = encodeURIComponent(window.location.href);
      }
      router.navigate({ to: '/auth/login/', search });
    }
  }, [user, isPending, router]);

  if (isPending) {
    return <Loader fullHeight />;
  }

  return <>{children}</>;
}

const RootLayout = () => (
  <Suspense fallback={<Loader fullHeight />}>
    <AuthGuard>
      <Outlet />
      <Toaster position="bottom-right" closeButton />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </AuthGuard>
  </Suspense>
);

export const Route = createRootRoute({ component: RootLayout });
