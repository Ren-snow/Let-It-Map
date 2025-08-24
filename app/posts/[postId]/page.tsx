import { auth } from "@/auth";
import PostPageClient from "@/components/ui/post-page";
import { prisma } from "@/lib/prisma";

export default async function PostPage({
    params,
}: {
    params: Promise<{ postId: string }>;
}) {
    const { postId } = await params;
    const session = await auth();
    const post = await prisma.post.findFirst({
        where: { id: postId },
        include: { location: true },
    });

    if (!post) {
        return <div>Post not found.</div>;
    }

    const isOwner = post.userId === session?.user?.id;

    return <PostPageClient post={post} isOwner={isOwner} />;
}
