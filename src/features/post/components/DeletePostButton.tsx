"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { api } from "@/lib/api/client";
import { Modal } from "@/components/ui/Modal";

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [isAsking, setIsAsking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await api.api.posts[":id"].$delete({
        param: { id: postId },
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? "Could not delete the post");
        setIsDeleting(false);
        return;
      }

      router.push("/posts");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsAsking(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      {isAsking && (
        <Modal onClose={() => (isDeleting ? undefined : setIsAsking(false))}>
          <div className="px-8 py-10">
            <h3 className="text-center font-serif text-xl tracking-tight">
              Delete this post?
            </h3>
            <p className="mt-2 text-center text-sm text-muted">
              This cannot be undone. The place itself stays on the map if other
              posts point to it.
            </p>

            {error && (
              <p className="mt-5 rounded-xl bg-accent-light px-4 py-3 text-sm text-accent">
                {error}
              </p>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsAsking(false)}
                className="rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:bg-foreground/5 active:scale-[0.98] disabled:opacity-50"
              >
                Keep it
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void remove()}
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-hover active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
