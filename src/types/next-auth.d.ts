import NextAuth, { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      studentProfile?: any;
      facultyProfile?: any;
      parentProfile?: any;
      adminProfile?: any;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    studentProfile?: any;
    facultyProfile?: any;
    parentProfile?: any;
    adminProfile?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    studentProfile?: any;
    facultyProfile?: any;
    parentProfile?: any;
    adminProfile?: any;
  }
} 