import { LogIn } from "lucide-react";
import { auth } from "@/lib/auth";
import { SignInButton } from "@/features/auth/components/SignInButton";
import { SignOutButton } from "@/features/auth/components/SignOutButton";

export async function ProfileScreen() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="font-serif text-3xl tracking-tight">Profile</h1>

      {user ? (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-4">
            {user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=""
                className="h-14 w-14 rounded-full object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold">{user.name ?? "Anonymous"}</p>
              {user.email && (
                <p className="truncate text-sm text-muted">{user.email}</p>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <SignOutButton />
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface py-16">
          <LogIn className="h-10 w-10 text-faint" />
          <p className="text-sm text-muted">Sign in to see your profile</p>
          <div className="mt-2">
            <SignInButton />
          </div>
        </div>
      )}
    </div>
  );
}
