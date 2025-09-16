import { NextAuthOptions, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      role?: "admin" | "user";
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    // Existing Credentials Provider (for admin login)
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          return {
            id: "admin",
            email: adminEmail!,
            name: "Admin",
            role: "admin",
          } as any;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.sub as string,
        email: session.user?.email || "",
        name: session.user?.name || "",
        role: (token as any).role ?? "user",
      };
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};

// For NextAuth v4 in the App Router, define route handlers in
// `app/api/auth/[...nextauth]/route.ts` using:
//   import NextAuth from "next-auth";
//   export const { GET, POST } = NextAuth(authOptions);

