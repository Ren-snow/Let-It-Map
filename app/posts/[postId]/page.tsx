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
    if (!session) {
        return <div>Please sign in.</div>;
    }
    const post = await prisma.post.findFirst({
        where: { id: postId, userId: session.user?.id },
        include: { location: true },
    });

    if (!post) {
        return <div>Post not found.</div>;
    }

    return <PostPageClient post={post} />;
}
