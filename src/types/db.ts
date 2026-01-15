import z from "zod";

export type UserRoles = "USER" | "ADMIN" | "HR" | "EMPLOYEE";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED" | "PENDING";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "BANNED", "PENDING"]),
  role: z.enum(["USER", "ADMIN", "HR", "EMPLOYEE"]),
  macAddress: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export const InsertUserSchema = UserSchema.omit({ id: true,
  status: true, role: true, createdAt: true, updatedAt: true }).extend({
    password: z.string().min(6),
});
export const UpdateUserSchema = InsertUserSchema.partial().omit({ password: true });

export type User = z.infer<typeof UserSchema>;

export type Session = {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
};

export const AttendenceSchema = z.object({
    id: z.string(),
    userId: z.string(),
    userName: z.string().optional(),
    manual: z.boolean().default(false),
    rssi: z.string().nullable(),
    date: z.date(),
    entryTime: z.date(),
    exitTime: z.date().nullable(),
});

export const InsertAttendenceSchema = AttendenceSchema.omit({ id: true });
export const UpdateAttendenceSchema = InsertAttendenceSchema.partial().omit({
  userId: true,
  date: true,
  entryTime: true,
});
export type Attendence = z.infer<typeof AttendenceSchema>;
