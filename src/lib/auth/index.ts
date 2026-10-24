import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/server/db";
import * as schema from "@/server/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      issuer: "https://github.com/login/oauth",
    }),
  ],
  pages: {
    signIn: "/welcome",
  },
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      // Everything is public by default — the map, the feed and the profile tab
      // are reachable signed out, for discovery and SEO. Screens that need an
      // account render their own sign-in prompt; only writes are gated here.
      const protectedPaths = ["/posts/create"];

      const isProtected = protectedPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
      );

      return isProtected ? !!auth?.user : true;
    },
  },

  secret: process.env.AUTH_SECRET,
});
