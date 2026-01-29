import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { userFieldsObject } from "./fields";

export const authClient = createAuthClient({
    baseURL: env.VITE_PUBLIC_AUTH_API_URL,
    fetchOptions: {
        credentials: "omit",
        auth: {
            type: "Bearer",
            token: () => localStorage.getItem("bearer_token") || "",
        },
        onSuccess(context) {
            const authToken = context.response.headers.get("set-auth-token");
            
            if (authToken) {
                localStorage.setItem("bearer_token", authToken);
            }
        },
    },
    sessionOptions: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
        refetchOnMount: false,
    },
    plugins: [inferAdditionalFields({ user: userFieldsObject })],
});
