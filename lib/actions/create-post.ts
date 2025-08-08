"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";
import { preparePostData } from "./post-helpers";

export async function createPost(formData: FormData) {
    const session = await auth();
    if (!session || !session.user?.id) {
        throw new Error("Not authenticated.");
    }

    const data = await preparePostData(formData);

    await prisma.post.create({
        data: {
            ...data,
            userId: session.user.id,
        },
    });

    redirect("/posts");
}
