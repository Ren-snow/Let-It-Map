import { notFound, redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { auth } from "@/lib/auth";
import { SignInButton } from "@/features/auth";
import * as postService from "@/server/post/service";
import { EditPostForm } from "../components/EditPostForm";

export type PostEditScreenProps = {
  params: Promise<{ id: string }>;
};

export async function PostEditScreen({ params }: PostEditScreenProps) {
  const { id } = await params;
  const [post, session] = await Promise.all([postService.get(id), auth()]);

  if (!post) notFound();

  // The post is public, so sending a stranger here is a mistake, not a secret.
  if (session?.user && session.user.id !== post.user.id) {
    redirect(`/posts/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl tracking-tight">Edit Post</h1>
        <p className="mt-2 text-sm text-muted">Change what you wrote</p>
      </div>

      {session?.user ? (
        <EditPostForm
          postId={post.id}
          initialValues={{ title: post.title, description: post.description }}
          place={{ name: post.location.name, address: post.location.address }}
        />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface py-16">
          <LogIn className="h-10 w-10 text-faint" />
          <p className="text-sm text-muted">Sign in to edit your post</p>
          <div className="mt-2">
            <SignInButton />
          </div>
        </div>
      )}
    </div>
  );
}
