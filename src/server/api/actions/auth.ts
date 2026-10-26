"use server";

import { signIn, signOut } from "@/lib/auth";

export async function handleSignIn(provider: string, callbackUrl?: string) {
  await signIn(provider, callbackUrl ? { redirectTo: callbackUrl } : undefined);
}

export async function handleSignOut() {
  await signOut();
}
