import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignInButton, SignOutButton } from "@/features/auth";

function PinSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className ?? "h-4 w-4"}
    >
      <path
        fillRule="evenodd"
        d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.827 3.024Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export async function Header() {
  const session = await auth();
  return (
    <header className="fixed top-0 z-50 h-header w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/welcome" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <PinSvg className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Let It Map
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-muted transition-colors hover:text-foreground">
              About
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Open the map
            </Link>
          </nav>
          {session ? (
            <SignOutButton />
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </header>
  );
}
