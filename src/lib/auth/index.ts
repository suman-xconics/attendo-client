import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import {
    inferAdditionalFields,
} from "better-auth/client/plugins";
import { userFieldsObject } from "./fields";

export const authClient = createAuthClient({
    baseURL: env.VITE_PUBLIC_AUTH_API_URL,
    fetchOptions: {
        credentials: "include",
    },
    sessionOptions: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
        refetchOnMount: false,
    },
    plugins: [
        inferAdditionalFields({ user: userFieldsObject }),
    ],
});
