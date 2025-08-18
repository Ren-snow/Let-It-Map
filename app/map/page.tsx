import { auth } from "@/auth";
// import SignInButton from "@/components/ui/SignInButton";
import { prisma } from "@/lib/prisma";
import MapClient from "@/components/ui/map-page";

export default async function MapPage() {
    const session = await auth();
    const posts = await prisma.post.findMany({
        include: {
            location: true,
        },
    });

    return (
        <MapClient posts={posts} session={session} />
    );
}
