// lib/api/query-keys.ts
import type { FPSClientInput } from "@/utils/query/fps-client-builder";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const usersKeys = createQueryKeys("users", {
    all: null,
    details: (id: string) => ({
        queryKey: [id],
    }),
    list: (params: FPSClientInput) => ({
        queryKey: [params],
    }),
});

export const attendanceKeys = createQueryKeys("attendance", {
    all: null,
    details: (id: string) => ({
        queryKey: [id],
    }),
    list: (params: FPSClientInput) => ({
        queryKey: [params],
    }),
    list_by_employee: (employeeId: string, params: FPSClientInput) => ({
        queryKey: [employeeId, params],
    }),
});


export const queryKeys = {
    users: usersKeys,
    attendance: attendanceKeys,
};
