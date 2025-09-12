import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

