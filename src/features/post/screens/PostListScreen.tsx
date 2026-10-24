import Link from "next/link";
import { PlusIcon, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import * as postService from "@/server/post/service";
import PostCard from "../components/PostCard";
import PostTabs from "../components/PostTabs";
import Pagination from "../components/Pagination";
import type { TabKey } from "../components/PostTabs";

export type PostListScreenProps = {
  searchParams: Promise<{ tab?: string; page?: string }>;
};

export async function PostListScreen({ searchParams }: PostListScreenProps) {
  const { tab, page } = await searchParams;
  const currentTab: TabKey = tab === "mine" ? "mine" : "all";
  const currentPage = Math.max(1, Number(page) || 1);
  const session = await auth();

  const showMine = currentTab === "mine" && !!session?.user;

  const result = await postService.list({
    page: currentPage,
    pageSize: 20,
    userId: showMine ? session?.user?.id : undefined,
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Posts</h1>
          <p className="mt-1 text-sm text-muted">
            Discover places shared by the community
          </p>
        </div>
        <Link
          href="/posts/create"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <PlusIcon className="h-4 w-4" />
          Add Post
        </Link>
      </div>

      {/* Tabs */}
      <PostTabs currentTab={currentTab} />

      {/* Sign-in prompt for "Your Posts" when not logged in */}
      {currentTab === "mine" && !session?.user && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface py-16">
          <FileText className="h-10 w-10 text-faint" />
          <p className="text-sm text-muted">Sign in to see your posts</p>
        </div>
      )}

      {/* Empty state */}
      {(showMine || currentTab === "all") && result.data.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface py-16">
          <FileText className="h-10 w-10 text-faint" />
          <p className="text-sm text-muted">
            {showMine
              ? "You haven't shared any places yet"
              : "No posts yet. Be the first to share a place!"}
          </p>
          <Link
            href="/posts/create"
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <PlusIcon className="h-4 w-4" />
            Create Post
          </Link>
        </div>
      )}

      {/* Post list */}
      {result.data.length > 0 && (
        <div className="flex flex-col gap-5">
          {result.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination page={result.page} totalPages={result.totalPages} tab={currentTab} />

    </div>
  );
}
