"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { PostForm, type PostDraft } from "./PostForm";

export function EditPostForm({
  postId,
  initialValues,
  place,
}: {
  postId: string;
  initialValues: { title: string; description: string };
  place: { name: string; address: string };
}) {
  const router = useRouter();

  async function submit(draft: PostDraft) {
    try {
      // The place is fixed, so only what the author wrote is sent.
      const response = await api.api.posts[":id"].$put({
        param: { id: postId },
        json: { title: draft.title, description: draft.description },
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        return body.error ?? "Could not save the post";
      }

      router.push(`/posts/${postId}`);
      router.refresh();
      return null;
    } catch {
      return "Could not reach the server. Please try again.";
    }
  }

  return (
    <PostForm
      place={{ editable: false, ...place }}
      initialValues={initialValues}
      submitLabel="Save changes"
      pendingLabel="Saving..."
      cancelHref={`/posts/${postId}`}
      onSubmit={submit}
    />
  );
}
