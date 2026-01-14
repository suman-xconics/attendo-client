export type UserRoles = "USER" | "ADMIN" | "HR" | "EMPLOYEE";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED" | "PENDING";

export type User = {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  image: string | null;
  phoneNumber: string | null;
  status: UserStatus;
  role: UserRoles;
  macAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
};

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

export type Attendence = {
    id: string;
    userId: string;
    rssi: string | null;
    deviceTime: Date;
    date: Date;
    entryTime: Date;
    exitTime: Date | null;
};
