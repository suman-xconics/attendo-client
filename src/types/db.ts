import z from "zod";

export type UserRoles = "USER" | "ADMIN" | "HR" | "EMPLOYEE";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  role: z.enum(["USER", "ADMIN", "HR", "EMPLOYEE"]),
  macAddress: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const InsertUserSchema = UserSchema.omit({
  id: true,
  role: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(6),
});
export const UpdateUserSchema = InsertUserSchema.partial().omit({
  password: true,
});

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
  row_id: z.string(),
  id_value: z.string().nullable(),
  person_name: z.string().nullable(),
  date: z.coerce.date(),
  entry_time: z.coerce.date(),
  exit_time: z.coerce.date(),
});

export const InsertAttendenceSchema = AttendenceSchema.omit({
  row_id: true,
  date: true,
  person_name: true,
}).extend({
  entry_time: z.coerce.date(),
  exit_time: z.coerce.date(),
});



export type Attendence = z.infer<typeof AttendenceSchema>;
