import { authClient } from "@/lib/auth";
import type { Session, User, UserRoles, UserStatus } from "@/types/db";
import { createContext, useContext, type ReactNode, useMemo } from "react";

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  role: UserRoles | null;
  status: UserStatus | null;
  isPending: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending, error } = authClient.useSession();

  const value = useMemo(() => ({
    session: (data?.session as Session) ?? null,
    user: (data?.user as User) ?? null,
    role: (data?.user as User)?.role ?? null,
    status: (data?.user as User)?.status ?? null,
    isPending,
    error: error ?? null,
  }), [data, isPending, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
