import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Navigation, Pencil } from "lucide-react";
import { auth } from "@/lib/auth";
import { DeletePostButton } from "../components/DeletePostButton";
import * as postService from "@/server/post/service";
import { MapProvider, LocationMiniMap } from "@/features/map";

export type PostDetailScreenProps = {
  params: Promise<{ id: string }>;
};

export async function PostDetailScreen({ params }: PostDetailScreenProps) {
  const { id } = await params;
  const [post, session] = await Promise.all([postService.get(id), auth()]);

  if (!post) notFound();

  const isAuthor = session?.user?.id === post.user.id;

  const initials = post.user.name?.charAt(0).toUpperCase() ?? "?";
  const publishedAt = post.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-2xl px-5 py-8">
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to posts
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <h1 className="font-serif text-3xl leading-tight tracking-tight">
          {post.title}
        </h1>

        {isAuthor && (
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/posts/${post.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
            <DeletePostButton postId={post.id} />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {post.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.user.image}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt text-xs font-medium text-muted">
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-medium">
            {post.user.name ?? "Anonymous"}
          </p>
          <p className="text-xs text-faint">{publishedAt}</p>
        </div>
      </div>

      <p className="mt-6 whitespace-pre-wrap leading-relaxed">
        {post.description}
      </p>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border">
        <div className="h-56">
          <MapProvider>
            <LocationMiniMap
              lat={post.location.latitude}
              lng={post.location.longitude}
            />
          </MapProvider>
        </div>

        <div className="flex items-start gap-3 border-t border-border bg-surface p-4">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">{post.location.name}</p>
            {post.location.address !== post.location.name && (
              <p className="mt-0.5 text-sm text-muted">
                {post.location.address}
              </p>
            )}
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${post.location.latitude},${post.location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Directions"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border transition-colors hover:bg-foreground/5"
          >
            <Navigation className="h-4 w-4" />
          </a>
        </div>
      </section>
    </article>
  );
}
