"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInModal } from "./SignInModal";

/**
 * A link that asks for an account first. Signed out, it opens the sign-in
 * modal over the current screen instead of navigating away, and sends the user
 * to `href` once the provider returns them.
 */
export function AuthGatedLink({
  href,
  isAuthenticated,
  className,
  style,
  "aria-label": ariaLabel,
  children,
}: {
  href: string;
  isAuthenticated: boolean;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  children: React.ReactNode;
}) {
  const [isAsking, setIsAsking] = useState(false);

  if (isAuthenticated) {
    return (
      <Link href={href} className={className} style={style} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsAsking(true)}
        className={className}
        style={style}
        aria-label={ariaLabel}
      >
        {children}
      </button>
      {isAsking && (
        <SignInModal onClose={() => setIsAsking(false)} callbackUrl={href} />
      )}
    </>
  );
}
