import { Plan } from '../generated/prisma/enums';
import { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { prisma } from "./prisma";

interface ExtendedSession extends DefaultSession {
  user: {
    id: string;
    email?: string | null;
    avatar?: string | null;
    plan?: string;
    usageCount?: number;
    usageLimit?: number;
  } & DefaultSession["user"];
}

const common = async ({
  email,
  name,
  avatar,
  plan,
  usageCount,
  usageLimit,
}: {
  email: string;
  name: string;
  avatar: string;
  plan: Plan;
  usageCount: number;
  usageLimit: number;
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          avatar,
          plan,
          usageCount,
          usageLimit,
        },
      });
      return user;
    } else {
      return user;
    }
  } catch (error) {
    console.log(error);
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: async (profile) => {
        await common({
          email: profile?.email ?? '',
          name: profile.name ?? '',
          avatar: profile.picture ?? '',
          plan: "Free",
          usageCount: 0,
          usageLimit: 3,
        });
        return {
          id: profile.sub, 
          email: profile.email,
          name: profile.name,
          image: profile.picture, 
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // JWT callback to add custom fields to the token
    async jwt({ token, user }: { token: JWT; user: ExtendedSession["user"] }) {
      if (user) {
        token.email = user.email;
        token.avatar = user.image;
        token.plan = "Free";
        token.usageCount = 0;
        token.usageLimit = 3;
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: JWT }) {
      session.user.email = token.email ?? '';
      session.user.avatar = token.avatar ?? '';
      session.user.plan = token.plan ?? 'Free';
      session.user.usageCount = token.usageCount ?? 0;
      session.user.usageLimit = token.usageLimit ?? 3;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};