"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { PostForm, type PostDraft } from "./PostForm";
import type { PlaceDetails } from "@/hooks/usePlacePredictions";

export function CreatePostForm({
  initialPlace,
}: {
  initialPlace?: PlaceDetails | null;
}) {
  const router = useRouter();

  async function submit(draft: PostDraft) {
    try {
      const response = await api.api.posts.$post({ json: draft });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        return body.error ?? "Could not create the post";
      }

      // The feed is a server component, so refresh before navigating to it.
      router.push("/posts");
      router.refresh();
      return null;
    } catch {
      return "Could not reach the server. Please try again.";
    }
  }

  return (
    <PostForm
      place={{ editable: true, initial: initialPlace ?? null }}
      submitLabel="Create Post"
      pendingLabel="Creating..."
      cancelHref="/posts"
      onSubmit={submit}
    />
  );
}
