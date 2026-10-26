import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export type AuthErrorScreenProps = {
  searchParams: Promise<{ error?: string }>;
};

/** NextAuth reports the failure as a code in the query string. */
const MESSAGES: Record<string, { title: string; detail: string }> = {
  OAuthAccountNotLinked: {
    title: "This email is already registered",
    detail:
      "You signed up with a different provider. Use the one you signed up with — the email address is the same either way.",
  },
  AccessDenied: {
    title: "Access denied",
    detail: "The provider refused the request, or you cancelled it.",
  },
  Verification: {
    title: "This link has expired",
    detail: "Sign-in links can only be used once. Please start again.",
  },
  Configuration: {
    title: "Sign-in is misconfigured",
    detail:
      "The server could not complete the handshake. This one is on us — check the server logs.",
  },
};

const FALLBACK = {
  title: "Could not sign you in",
  detail: "Something went wrong on the way back from the provider.",
};

export async function AuthErrorScreen({ searchParams }: AuthErrorScreenProps) {
  const { error } = await searchParams;
  const { title, detail } = (error && MESSAGES[error]) || FALLBACK;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light text-accent">
        <TriangleAlert className="h-7 w-7" />
      </div>

      <h1 className="font-serif text-3xl tracking-tight">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{detail}</p>

      {error && (
        <p className="mt-4 font-mono text-xs text-faint">{error}</p>
      )}

      <Link
        href="/"
        className="mt-8 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Back to the map
      </Link>
    </div>
  );
}
