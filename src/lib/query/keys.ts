// lib/api/query-keys.ts
import { createQueryKeys } from "@lukemorales/query-key-factory";
import id from "zod/v4/locales/id.cjs";

export const usersKeys = createQueryKeys("users", {
    all: null,
    details: (id: string) => ({
        queryKey: [id],
    }),
});


export const queryKeys = {
    users: usersKeys,
};
