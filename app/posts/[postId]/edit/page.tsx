
"use server"
import { prisma } from "@/lib/prisma";
import EditForm from "@/components/ui/edit-form";

export default async function EditPost(props: { params: Promise<{ postId: string }> }) {
    const params = await props.params;
    const post = await prisma.post.findUnique({
        where: { id: params.postId },
        include: { location: true },
    });
    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <>
            <EditForm post={post} />
        </>
    );
}
