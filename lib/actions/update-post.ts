"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";
import { preparePostData } from "./post-helpers";

export async function updatePost(postId: string, formData: FormData) {
    const session = await auth();
    if (!session || !session.user?.id) {
        throw new Error("Not authenticated.");
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        throw new Error("Post not found.");
    }

    const data = await preparePostData(formData);

    await prisma.post.update({
        where: {
            id: postId,
            userId: session.user.id,
        },
        data: {
            ...data,
            userId: session.user.id,
        },
    });

    redirect(`/posts/${postId}`);
}
