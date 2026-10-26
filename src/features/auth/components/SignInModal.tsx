"use client";

import { handleSignIn } from "@/server/api/actions/auth";
import { Modal } from "@/components/ui/Modal";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-5 w-5"}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "h-5 w-5"}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "h-6 w-6"}>
      <path
        fillRule="evenodd"
        d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.827 3.024Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SignInModal({
  onClose,
  callbackUrl,
}: {
  onClose: () => void;
  /** Where to land once the provider sends the user back. */
  callbackUrl?: string;
}) {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center px-8 py-10">
        {/* Logo & Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white">
            <PinIcon className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Join the Journey
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Sign in to share your Beatles experiences
          </p>
        </div>

        {/* Sign In Buttons */}
        <div className="w-full space-y-3">
          <form action={handleSignIn.bind(null, "google", callbackUrl)}>
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-surface-alt active:scale-[0.98]"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          <form action={handleSignIn.bind(null, "github", callbackUrl)}>
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-border bg-foreground px-5 py-3.5 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <GitHubIcon className="h-5 w-5 text-background" />
              Continue with GitHub
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-faint">
          By signing in, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </Modal>
  );
}
