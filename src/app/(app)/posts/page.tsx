import { PostListScreen } from "@/features/post/screens/PostListScreen";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  return <PostListScreen searchParams={await searchParams} />;
}
