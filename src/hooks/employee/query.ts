import type { User } from "@/types/db";
import { createApiQueryHook } from "../tanstack-builder";
import { queryKeys } from "@/lib/query/keys";

export const useEmployeeDetails = createApiQueryHook<
  User, 
  { id: string }
>({
  endpoint: "/employees/:id",
  queryKey: queryKeys.users.details(":id").queryKey,
  defaultStrategy: "stable",
  method: "GET"
});

