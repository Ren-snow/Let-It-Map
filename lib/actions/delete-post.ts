"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePost(postId: string) {
    const session = await auth();
    if (!session || !session.user?.id) {
        throw new Error("Not authenticated.");
    }

    await prisma.$transaction(async (tx) => {

        const deletedPost = await tx.post.delete({
            where: { id: postId },
        });

        const otherPosts = await tx.post.findMany({
            where: { locationId: deletedPost.locationId },
        });

        if (otherPosts.length === 0) {
            await tx.location.delete({
                where: { id: deletedPost.locationId },
            });
        }
    });

    revalidatePath("/posts");

    redirect("/posts");
}
