import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInButton from "@/components/ui/SignInButton";
import PostsPageClient from "@/components/ui/posts-page";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import BaseMap from "@/components/map/BaseMap";

export default async function PostsPage() {
    const session = await auth();
    const posts = await prisma.post.findMany({
        include: {
            location: true,
        },
        where: {
            userId: session?.user?.id,
        },
    });

    if (!session) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
                Please Sign In.
                <SignInButton />
            </div>
        );
    }
    return (
        <div className="space-y-6 container mx-auto px-4 py-8">
            <div className="space-y-6 container mx-auto px-4 py-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Posts List
                    </h1>
                    <Link href={"/posts/new"}>
                        <Button variant="customIndigo">
                            <Plus />
                            Add Post
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Welcome back, {session.user?.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            {posts.length === 0
                                ? "Let's visit a Beatles spot and create your first post!"
                                : `Total posts: ${posts.length}`}
                        </p>
                    </CardContent>
                </Card>
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        All Your Posts
                    </h2>
                    {posts.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                                <h3 className="text-xl font-medium mb-2">
                                    No posts yet.
                                </h3>
                                <p className="text-center mb-4 max-w-md">
                                    Create your first post.
                                </p>
                                <Link href={"/posts/new"}>
                                    <Button variant="customIndigo">
                                        New Post
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <PostsPageClient posts={posts}/>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Map</h2>
                    <BaseMap
                        center={
                            posts.length > 0
                                ? {
                                      lat: posts[0].location.lat,
                                      lng: posts[0].location.lng,
                                  }
                                : { lat: 53.405471, lng: -2.979881 }
                        }
                        zoom={12}
                        posts={posts}
                    />
                </div>
            </div>
        </div>
    );
}
