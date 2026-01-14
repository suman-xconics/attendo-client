import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/provider/auth';
import { Logo } from '@/components/shared/logo';
import { Suspense, useEffect } from 'react';
import { AUTH_PAGE_STATES, useAuthPageStore } from '@/store/auth';
import Loader from '@/components/shared/loader';
import { useRouter } from '@tanstack/react-router';
import { LoginForm } from '@/components/auth/login-form';

export const Route = createFileRoute('/auth/login/')({
  component: LoginPage
});

function LoginPage() {


  return (
 <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
       <Logo/>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/bg/auth-bg.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
