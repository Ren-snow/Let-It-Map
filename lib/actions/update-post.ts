"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export async function updatePost(postId: string, formData: FormData) {
    const session = await auth();
    if (!session || !session.user?.id) {
        throw new Error("Not authenticated.");
    }

    const title = formData.get("name")?.toString();
    const address = formData.get("address")?.toString();
    const dateStr = formData.get("date")?.toString();
    const content = formData.get("description")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();
    const lat = parseFloat(formData.get("lat")?.toString() || "0");
    const lng = parseFloat(formData.get("lng")?.toString() || "0");
''
    if (!title || !address) {
        throw new Error("Please enter both the place name and address.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = dateStr ? new Date(dateStr) : null;

    if (date && date.getTime() > today.getTime()) {
        throw new Error("Date is invalid.");
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        throw new Error("Post not found.");
    }

    let location = await prisma.location.findFirst({
        where: { address: address },
    });

    if (!location) {
        location = await prisma.location.create({
            data: {
                address: address || "",
                lat,
                lng,
            },
        });
    }

    await prisma.post.update({
        where: {
            id: postId,
            userId: session.user.id,
        },
        data: {
            title,
            date,
            content,
            imageUrl,
            userId: session.user.id,
            locationId: location.id,
        },
    });

    redirect(`/posts/${postId}`);
}
