import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

// Extend the session type to include credits
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      credits: number;
    };
  }
}

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to the JWT token when it's created
      if (user) {
        token.id = user.id;
        token.credits = (user as any).credits || 4;
      }
      return token;
    },
    async session({ session, token, user }) {
      // For JWT strategy, use the token
      if (token) {
        session.user.id = token.id as string;
        session.user.credits = token.credits as number;
      } 
      // For database strategy, use the user
      else if (user) {
        const dbUser = user as User;
        session.user.id = dbUser.id;
        session.user.credits = dbUser.credits;
      }
      
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 