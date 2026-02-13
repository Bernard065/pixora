import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      avatar?: string | null;
      plan?: string;
      usageCount?: number;
      usageLimit?: number;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string | null;
    avatar?: string | null;
    plan?: string;
    usageCount?: number;
    usageLimit?: number;
  }
}
