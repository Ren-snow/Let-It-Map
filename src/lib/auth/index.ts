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
    // Every page is reachable signed out. Redirecting someone to the landing
    // page mid-task loses their context, so screens ask for an account
    // themselves instead. The real boundary is the API, which answers 401.
    authorized: () => true,
  },

  secret: process.env.AUTH_SECRET,
});
