// import AddressInput from "@/components/map/AddressInput";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { UploadButton } from "@/lib/upload-thing";
// import Image from "next/image";
"use server"
import { prisma } from "@/lib/prisma";
import EditForm from "@/components/ui/edit-form";

export default async function EditPost({ params }: { params: { postId: string } }) {
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
