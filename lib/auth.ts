import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

/*
  🔑 GOOGLE OAUTH SETUP INSTRUCTIONS 🔑
  
  To enable Google Login, you need to:
  
  1. Go to Google Cloud Console: https://console.cloud.google.com/
  
  2. Create a new project or select an existing one
  
  3. Enable the Google+ API:
     - Go to "APIs & Services" > "Library"
     - Search for "Google+ API" and enable it
  
  4. Create OAuth 2.0 credentials:
     - Go to "APIs & Services" > "Credentials"
     - Click "Create Credentials" > "OAuth client ID"
     - Choose "Web application"
     - Add authorized redirect URIs:
       * For development: http://localhost:3000/api/auth/callback/google
       * For production: https://yourdomain.com/api/auth/callback/google
  
  5. Add these environment variables to your .env.local file:
     
     GOOGLE_CLIENT_ID="your_google_client_id_here"
     GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
     
     NEXTAUTH_URL="http://localhost:3000" (for development)
     NEXTAUTH_SECRET="your_random_secret_key_here" (generate with: openssl rand -base64 32)
  
  6. Make sure your domain is added to authorized origins in Google Console
  
  💡 Pro tip: Keep your Google credentials secure and never commit them to version control!
*/

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

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

