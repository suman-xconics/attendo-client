// lib/api/query-keys.ts
import type { FPSClientInput } from "@/utils/query/fps-client-builder";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import id from "zod/v4/locales/id.cjs";

export const usersKeys = createQueryKeys("users", {
    all: null,
    details: (id: string) => ({
        queryKey: [id],
    }),
    list: (params: FPSClientInput) => ({
        queryKey: [params],
    }),
});


export const queryKeys = {
    users: usersKeys,
};
